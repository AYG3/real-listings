"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/authClient";
import { AuthShell } from "@/components/auth/auth-shell";
import {
  AuthFooterLinks,
  CredentialsForm,
} from "@/components/auth/credentials-form";
import { Input } from "@/components/ui/field";

export default function SignupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(credentials: { email: string; password: string }) {
    if (!name.trim()) {
      setError("Enter your name so agents know who they are talking to.");
      return;
    }

    if (credentials.password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email: credentials.email,
      password: credentials.password,
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message ?? "Unable to create your account");
      return;
    }

    toast.success("Account created. Sign in to continue.");
    router.push("/login");
  }

  return (
    <AuthShell
      title="Create an account"
      subtitle="Save properties and track your enquiries in one place."
      footer={
        <AuthFooterLinks
          prompt="Already have an account?"
          href="/login"
          linkLabel="Sign in"
        />
      }
    >
      <CredentialsForm
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
        submitLabel="Create account"
        autoComplete="new-password"
        header={
          <Input
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Obi"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        }
        fields={
          <>
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <p className="mb-5 rounded-control border border-forest-700/15 bg-forest-700/5 px-3 py-2.5 text-xs font-medium text-forest-700">
              Want to list properties?{" "}
              <a
                className="underline underline-offset-2"
                href="/agent/auth/register"
              >
                Apply as an agent
              </a>
              .
            </p>
          </>
        }
      />
    </AuthShell>
  );
}
