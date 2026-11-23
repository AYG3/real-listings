"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/authClient";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

const FALLBACK_ERROR =
  "Google sign-in failed. Try again, or use your email and password.";

export default function GoogleSignInButton({
  callbackURL = "/",
  errorCallbackURL = "/login",
  label = "Continue with Google",
}: {
  callbackURL?: string;
  /** Where Google sends the browser when the provider reports an error. */
  errorCallbackURL?: string;
  label?: string;
}) {
  const [redirecting, setRedirecting] = useState(false);

  async function handleClick() {
    if (redirecting) return;
    setRedirecting(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
      errorCallbackURL,
    });

    // On success the browser leaves for Google, so this only runs when the
    // hand-off failed — a misconfigured client, a blocked popup, or offline.
    if (error) {
      setRedirecting(false);
      toast.error(error.message?.trim() || FALLBACK_ERROR);
    }
  }

  return (
    <Button
      variant="secondary"
      size="md"
      className="w-full"
      onClick={handleClick}
      disabled={redirecting}
      aria-busy={redirecting || undefined}
    >
      <FcGoogle size={18} aria-hidden />
      {redirecting ? "Redirecting to Google…" : label}
    </Button>
  );
}
