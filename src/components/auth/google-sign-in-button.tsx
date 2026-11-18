"use client";

import { authClient } from "@/lib/auth/authClient";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function GoogleSignInButton({
  callbackURL = "/",
  label = "Continue with Google",
}: {
  callbackURL?: string;
  label?: string;
}) {
  async function handleClick() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });
  }

  return (
    <Button
      variant="secondary"
      size="md"
      className="w-full"
      onClick={handleClick}
    >
      <FcGoogle size={18} aria-hidden />
      {label}
    </Button>
  );
}
