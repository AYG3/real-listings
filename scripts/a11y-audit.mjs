/**
 * Accessibility audit with axe-core in a real browser, against a running build.
 *
 *   npm run a11y                       # audits http://localhost:3000
 *   BASE_URL=http://localhost:3001 npm run a11y
 *   VIEWPORT_WIDTH=375 npm run a11y    # mobile pass; default is 1440×900
 *
 * Needs Chrome; set CHROME_PATH if it is not at the default macOS location.
 * The admin/agent pages need the seeded admin account, so they are skipped when
 * sign-in fails (a fresh database that has not been seeded, for example).
 *
 * Exits non-zero if any page reports a violation, which is what makes this
 * usable in CI once a preview server is running.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { setTimeout as sleep } from "node:timers/promises";

const require = createRequire(import.meta.url);
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const PORT = Number(process.env.CDP_PORT ?? 9226);
const WIDTH = Number(process.env.VIEWPORT_WIDTH ?? 1440);
const HEIGHT = Number(process.env.VIEWPORT_HEIGHT ?? 900);
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const PUBLIC_PAGES = ["/", "/properties", "/properties/wuse-2-3-bedroom-terrace", "/login", "/demo"];
const AUTH_PAGES = ["/admin/overview", "/admin/moderation", "/agent/dashboard"];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=/tmp/chrome-a11y-${process.pid}`,
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "about:blank",
], { stdio: "ignore" });

async function connect() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await sleep(250);
    try {
      const version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      if (version.webSocketDebuggerUrl) return version.webSocketDebuggerUrl;
    } catch {}
  }
  throw new Error(`Chrome did not expose CDP on port ${PORT}`);
}

await connect();
const target = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" }).then((r) => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

let nextId = 0;
const pending = new Map();
const events = [];
socket.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.id && pending.has(data.id)) {
    pending.get(data.id)(data);
    pending.delete(data.id);
  } else if (data.method) {
    events.push(data.method);
  }
};

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

const waitForEvent = async (name, timeoutMs = 20000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (events.includes(name)) {
      events.splice(0, events.indexOf(name) + 1);
      return;
    }
    await sleep(50);
  }
};

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.result?.exceptionDetails) throw new Error(result.result.exceptionDetails.text);
  return result.result?.result?.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: HEIGHT,
  deviceScaleFactor: 1,
  mobile: WIDTH < 700,
});
console.log(`Viewport ${WIDTH}x${HEIGHT}\n`);

const visit = async (path) => {
  await send("Page.navigate", { url: BASE + path });
  await waitForEvent("Page.loadEventFired");

  // Streamed routes can paint the landmark before the page content lands;
  // wait for <main> instead of trusting the load event alone.
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await evaluate(`Boolean(document.querySelector("main"))`)) break;
    await sleep(150);
  }

  await sleep(600);
};

const runAxe = async () => {
  await evaluate(AXE);
  return evaluate(`axe.run(document, { runOnly: { type: "tag", values: ${JSON.stringify(TAGS)} } })
    .then((report) => ({
      violations: report.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => node.target.join(" ")),
      })),
      incomplete: report.incomplete.length,
      passes: report.passes.length,
    }))`);
};

const report = (label, result) => {
  const count = result.violations.reduce((sum, violation) => sum + violation.nodes.length, 0);

  console.log(
    `${result.violations.length === 0 ? "PASS" : "FAIL"}  ${label.padEnd(44)} ` +
      `${result.violations.length} rules, ${count} nodes, ${result.passes} passes`,
  );

  for (const violation of result.violations) {
    console.log(`        ${violation.impact}: ${violation.id} — ${violation.help}`);
    for (const node of violation.nodes.slice(0, 3)) console.log(`          ${node}`);
    if (violation.nodes.length > 3) console.log(`          … ${violation.nodes.length - 3} more`);
  }

  return result.violations.length;
};

// SelectField only renders its listbox once opened, so the resting page audit
// never sees the popup. Open the first one and audit that state too.
const openFirstCombobox = () =>
  evaluate(`(() => {
    const trigger = document.querySelector('[role="combobox"][aria-expanded]');
    if (!trigger) return false;
    trigger.click();
    return true;
  })()`);

const audit = async (path) => {
  await visit(path);
  let failures = report(path, await runAxe());

  if (await openFirstCombobox()) {
    await sleep(300);
    const options = await evaluate(`document.querySelectorAll('[role="option"]').length`);
    if (options > 0) failures += report(`${path} (dropdown open)`, await runAxe());
  }

  return failures;
};

let failures = 0;

for (const path of PUBLIC_PAGES) failures += await audit(path);

const signedIn = await evaluate(`fetch("/api/auth/sign-in/email", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ email: "admin@alara.ng", password: "AlaraAdmin1!" }),
}).then((response) => response.status)`);

if (signedIn === 200) {
  for (const path of AUTH_PAGES) failures += await audit(path);
} else {
  console.log(`SKIP  authenticated pages — sign-in returned ${signedIn}; run \`npm run db:seed\` first`);
}

socket.close();
chrome.kill();

console.log(failures === 0 ? "\nNo accessibility violations found." : `\n${failures} violating rule(s).`);
process.exit(failures === 0 ? 0 : 1);
