"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth";

export type LoginState = {
  error?: string;
  success?: string;
} | null;

export async function login(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });

    // After sign-in, verify the user is actually an AGENT
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role !== "AGENT") {
      await auth.api.signOut({
        headers: await headers(),
      });
      return { error: "Access denied. This login is for agents only." };
    }

    console.log("Signed In Successfully – result: ", result);

    return { success: "Signed in successfully" };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.body?.message ?? "Unable to sign in" };
    }
    console.log("error", error);

    return { error: "Invalid email or password" };
  }
}
