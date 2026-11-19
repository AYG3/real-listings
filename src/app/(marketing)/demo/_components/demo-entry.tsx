"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type Props = {
  email: string;
  password: string;
  next: string;
  label: string;
};

/**
 * Signs in through the same Better Auth endpoint the login form uses, then
 * lands on the role's home. No custom session minting, no auth bypass.
 */
export function DemoEntry({ email, password, next, label }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setError(null);

    const response = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe: false }),
    });

    if (!response.ok) {
      setError("That demo account is not seeded in this environment.");
      return;
    }

    startTransition(() => {
      router.push(next);
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-4 text-sm font-bold text-white transition-colors hover:bg-forest-800 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {pending ? "Opening…" : label}
        {!pending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
