"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/authClient";
import {
  AuthFooterLinks,
  CredentialsForm,
} from "@/components/auth/credentials-form";
import GoogleSignInButton from "@/components/auth/google-sign-in-button";

const roleHomes = {
  ADMIN: "/admin/overview",
  AGENT: "/agent/dashboard",
  BUYER: "/",
} as const;

type Role = keyof typeof roleHomes;

function requiredRole(next: string | null): Role | null {
  if (!next) return null;
  if (next.startsWith("/admin")) return "ADMIN";
  if (next.startsWith("/agent")) return "AGENT";
  return null;
}

/** Only allow same-site relative paths as a post-login destination. */
function safeNext(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const gate = requiredRole(next);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(credentials: { email: string; password: string }) {
    setSubmitting(true);
    setError(null);

    const { data, error: signInError } = await authClient.signIn.email(
      credentials,
    );

    if (signInError) {
      setError(signInError.message ?? "Invalid email or password");
      setSubmitting(false);
      return;
    }

    const role = ((data?.user as { role?: Role } | undefined)?.role ??
      "BUYER") as Role;

    // A portal deep link must not be satisfied by the wrong role.
    if (gate && role !== gate) {
      await authClient.signOut();
      setError(
        gate === "ADMIN"
          ? "This account does not have admin access."
          : "This account does not have agent access.",
      );
      setSubmitting(false);
      return;
    }

    toast.success("Signed in");
    router.replace(next ?? roleHomes[role] ?? "/");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-h2 font-bold text-ink-900">
        {gate === "ADMIN"
          ? "Admin sign in"
          : gate === "AGENT"
            ? "Agent sign in"
            : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-muted-500">
        {gate
          ? "Use your portal credentials. Each role has its own access."
          : "Welcome back. Pick up where you left off."}
      </p>

      <div className="mt-6">
        <CredentialsForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          submitLabel="Sign in"
        >
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink-900/10" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-500">
              or
            </span>
            <span className="h-px flex-1 bg-ink-900/10" />
          </div>
          <GoogleSignInButton callbackURL={next ?? "/"} />
        </CredentialsForm>

        <AuthFooterLinks
          prompt="New here?"
          href="/signup"
          linkLabel="Create an account"
        />
      </div>
    </>
  );
}
