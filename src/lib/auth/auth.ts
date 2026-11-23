import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

// `BETTER_AUTH_URL` is the canonical origin: Better Auth derives the OAuth
// `redirect_uri` from it, so a value that disagrees with the port `next dev`
// binds to sends Google back to an address nothing is listening on. The one
// fallback below keeps a fresh clone working before `.env.local` exists.
const fallbackOrigins = ["http://localhost:3000"];

function resolveTrustedOrigins() {
  const configured = (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [
    ...new Set(
      [process.env.BETTER_AUTH_URL, ...configured, ...fallbackOrigins].filter(
        (origin): origin is string => Boolean(origin),
      ),
    ),
  ];
}

// Documented names first; the legacy CLIENT_ID/CLIENT_SECRET pair still works
// so an existing local env file keeps signing in.
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.CLIENT_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET ?? process.env.CLIENT_SECRET;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: resolveTrustedOrigins(),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days,
    updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "BUYER",
        input: false
      },
      // Read-only demo accounts (Phase 6). Exposed on the session so guards
      // can answer without another query.
      isDemo: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false
      }
    }
  },

  plugins: [nextCookies()]
});
