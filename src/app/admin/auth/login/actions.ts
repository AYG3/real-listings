"use server";

import { redirect } from "next/navigation";
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

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if(session?.user?.role !== "ADMIN"){
      await auth.api.signOut({
        headers: await headers(),
      });
      return { error: "Access denied. This login is for Administrators only. "}
    }

    return { success: "Signed in successfully" };
  } catch (error) {
    if (error instanceof  APIError){
      return { error: error.body?.message ?? "Unable to sign in"}
    }
    console.log("Error – Invalid email or password", error);
    return { error: "Invalid email or password" };
  }
}
