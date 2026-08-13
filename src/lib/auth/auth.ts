import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days,
    updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string
    }
  },

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
