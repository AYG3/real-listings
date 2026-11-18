"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

type Props = {
  onSubmit: (credentials: { email: string; password: string }) => void;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
  autoComplete?: "current-password" | "new-password";
  /** Extra fields rendered above the email input. */
  header?: React.ReactNode;
  /** Extra fields rendered after the password input. */
  fields?: React.ReactNode;
  /** Rendered below the submit button (e.g. social sign-in). */
  children?: React.ReactNode;
};

export function CredentialsForm({
  onSubmit,
  submitting = false,
  error,
  submitLabel = "Sign in",
  autoComplete = "current-password",
  header,
  fields,
  children,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="flex flex-col"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ email: email.trim(), password });
      }}
    >
      {header}

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Your password"
          autoComplete={autoComplete}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-2 top-[34px] flex h-9 w-9 items-center justify-center rounded-control text-muted-500 transition-colors hover:text-ink-900"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      {fields}

      {error ? (
        <p
          role="alert"
          className="mb-5 rounded-control border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-medium text-danger"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" loading={submitting} className="mt-1 w-full">
        {submitLabel}
      </Button>

      {children}
    </form>
  );
}

export function AuthFooterLinks({
  prompt,
  href,
  linkLabel,
}: {
  prompt: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-muted-500">
      {prompt}{" "}
      <Link
        href={href}
        className="font-semibold text-forest-700 underline-offset-4 hover:underline"
      >
        {linkLabel}
      </Link>
    </p>
  );
}
