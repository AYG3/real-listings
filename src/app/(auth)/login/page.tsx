import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

function LoginFallback() {
  return (
    <div
      aria-hidden
      className="animate-pulse space-y-4 motion-reduce:animate-none"
    >
      <div className="h-8 w-40 rounded-md bg-ink-900/10" />
      <div className="h-4 w-64 rounded-md bg-ink-900/10" />
      <div className="mt-6 h-11 rounded-control bg-ink-900/10" />
      <div className="h-11 rounded-control bg-ink-900/10" />
      <div className="h-[52px] rounded-control bg-ink-900/10" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
