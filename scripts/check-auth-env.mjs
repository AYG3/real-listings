/**
 * Preflight for `npm run dev`.
 *
 * Better Auth derives the OAuth `redirect_uri` from `BETTER_AUTH_URL`. When
 * that value names a port the dev server is not bound to, Google returns the
 * user to a dead address and the browser reports "page can't be reached" —
 * a failure that looks like a Google Console misconfiguration but is purely
 * local. This check is intentionally non-fatal: it explains the problem before
 * the server starts instead of letting the bug surface after consent.
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

const DEV_PORT = process.env.PORT?.trim() || "3000";
const problems = [];
const warnings = [];

function originOf(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const baseUrl = process.env.BETTER_AUTH_URL?.trim();
const origin = baseUrl ? originOf(baseUrl) : null;

if (!baseUrl) {
  warnings.push(
    "BETTER_AUTH_URL is not set. Cookies and OAuth callbacks fall back to the request origin, which breaks behind a proxy.",
  );
} else if (!origin) {
  problems.push(`BETTER_AUTH_URL is not a valid URL: "${baseUrl}".`);
} else {
  const basePort = new URL(baseUrl).port || "80";
  if (basePort !== DEV_PORT) {
    problems.push(
      `BETTER_AUTH_URL is "${baseUrl}" but this dev server listens on :${DEV_PORT}.\n` +
        `       Google sign-in would redirect to :${basePort}, where nothing is listening.\n` +
        `       Fix: set BETTER_AUTH_URL="http://localhost:${DEV_PORT}" in .env.local.`,
    );
  }

  const trusted = (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (trusted.length > 0 && !trusted.includes(origin)) {
    warnings.push(
      `TRUSTED_ORIGINS does not include ${origin}. Add it, or remove TRUSTED_ORIGINS to use BETTER_AUTH_URL alone.`,
    );
  }
}

if (!process.env.BETTER_AUTH_SECRET) {
  warnings.push(
    "BETTER_AUTH_SECRET is not set. Sessions will not survive a server restart. Generate one with: openssl rand -base64 32",
  );
}

const googleId = process.env.GOOGLE_CLIENT_ID ?? process.env.CLIENT_ID;
const googleSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env.CLIENT_SECRET;

if (Boolean(googleId) !== Boolean(googleSecret)) {
  problems.push(
    "Google OAuth is half-configured: set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or neither to hide the button.",
  );
}

for (const problem of problems) {
  console.warn(`\n[auth] ✖ ${problem}`);
}

for (const warning of warnings) {
  console.warn(`\n[auth] ⚠ ${warning}`);
}

if (problems.length === 0 && warnings.length === 0) {
  console.log(
    `[auth] ✓ BETTER_AUTH_URL matches :${DEV_PORT}; Google callback will return to ${origin}.`,
  );
} else if (problems.length > 0) {
  console.warn(
    `\n[auth] Sign-in may fail until the above is fixed. Expected Google redirect URI: http://localhost:${DEV_PORT}/api/auth/callback/google\n`,
  );
}
