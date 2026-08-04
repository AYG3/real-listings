"use server";

import { auth } from "@/lib/auth/auth";

export default async function login(formData: FormData): Promise<any> {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        callbackURL: '/agent/dashboard'
      },
    });
    console.log("Signed In Sucessfully – result: ", result);

  } catch (error) {
    console.log("error", error);

    return { error: "Invalid email or password" };
  }
}