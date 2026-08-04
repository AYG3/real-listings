"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

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
    return { success: "Signed in successfully" };
  } catch (error) {
    console.log("Error – Invalid email or password", error);
    return { error: "Invalid email or password" };
  }
}
