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
    console.log("Signed In Sucessfully – result: ", result);

  } catch (error) {
    console.log("error", error);

    return { error: "Invalid email or password" };
  }
}