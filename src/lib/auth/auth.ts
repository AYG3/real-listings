import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

const fallbackOrigins = ["http://localhost:3000", "http://localhost:3005"];

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

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ?? process.env.CLIENT_ID;
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
      }
    }
  },

  plugins: [nextCookies()]
});
