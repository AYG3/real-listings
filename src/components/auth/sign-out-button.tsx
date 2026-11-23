"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/authClient";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type SignOutButtonProps = {
  className?: string;
  label?: string;
  variant?: "ghost" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  /** Where to land after the session is cleared. */
  redirectTo?: string;
  /** Runs after the session is cleared and before the route changes. */
  onSignedOut?: () => void;
};

/**
 * The single sign-out control. Better Auth clears the cookie server-side; the
 * route refresh then re-renders every server component without a session.
 */
export function SignOutButton({
  className,
  label = "Sign out",
  variant = "ghost",
  size = "sm",
  redirectTo = "/",
  onSignedOut,
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(
          "We could not sign you out. Check your connection and try again.",
        );
        return;
      }

      toast.success("Signed out");
      onSignedOut?.();
      router.replace(redirectTo);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      aria-busy={pending || undefined}
      className={cn(
        buttonStyles({ variant, size, className }),
        "justify-start",
      )}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {pending ? "Signing out…" : label}
    </button>
  );
}
