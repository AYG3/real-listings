import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const APP_DIR = join(process.cwd(), "src/app");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}

/**
 * Body of every function in the file, exported or not, keyed by name. The body
 * opens at the first `{` after the parameter list that ends its line — return
 * types like `Promise<{ merged: number }>` contain braces of their own.
 */
function functionBodies(source: string): Map<string, { body: string; exported: boolean }> {
  const bodies = new Map<string, { body: string; exported: boolean }>();
  const signature = /(export\s+)?(?:async\s+)?function (\w+)\s*\(/g;

  for (const match of source.matchAll(signature)) {
    const paramsEnd = source.indexOf(")", match.index);
    let open = source.indexOf("{", paramsEnd);

    while (open !== -1 && source.slice(open + 1, open + 2) !== "\n") {
      open = source.indexOf("{", open + 1);
    }
    if (open === -1) continue;

    let depth = 0;
    let index = open;
    for (; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
    }

    bodies.set(match[2], { body: source.slice(open, index + 1), exported: Boolean(match[1]) });
  }

  return bodies;
}

const GUARDS = ["requireAgent(", "requireAdmin(", "getSession("];

/**
 * True when the body, or a local function it calls, satisfies the predicate.
 * Actions such as archive/restore delegate to a shared helper; the check
 * follows that one hop so delegation cannot hide an unguarded write.
 */
function satisfies(
  bodies: Map<string, { body: string }>,
  body: string,
  test: (candidate: string) => boolean,
): boolean {
  if (test(body)) return true;

  for (const [name, entry] of bodies) {
    const callsHelper = new RegExp(`\\b${name}\\s*\\(`).test(body);
    if (callsHelper && test(entry.body)) return true;
  }

  return false;
}

const actionFiles = walk(APP_DIR).filter((file) =>
  readFileSync(file, "utf8").startsWith('"use server"'),
);

const labelled = actionFiles.map((file) => [relative(process.cwd(), file), file] as const);

describe("server action boundaries", () => {
  it("finds every action module", () => {
    expect(labelled.length).toBeGreaterThanOrEqual(7);
  });

  it.each(labelled)("%s parses every action's input with a schema", (_label, file) => {
    const bodies = functionBodies(readFileSync(file, "utf8"));
    const actions = [...bodies].filter(([, entry]) => entry.exported);

    expect(actions.length).toBeGreaterThan(0);

    for (const [name, entry] of actions) {
      expect(
        satisfies(bodies, entry.body, (candidate) => candidate.includes(".safeParse(")),
        `${name} does not parse its input`,
      ).toBe(true);
    }
  });

  it.each(labelled)("%s authorises every action before writing", (_label, file) => {
    const bodies = functionBodies(readFileSync(file, "utf8"));
    const actions = [...bodies].filter(([, entry]) => entry.exported);

    for (const [name, entry] of actions) {
      expect(
        satisfies(bodies, entry.body, (candidate) =>
          GUARDS.some((guard) => candidate.includes(guard)),
        ),
        `${name} has no authorisation guard`,
      ).toBe(true);
    }
  });
});
