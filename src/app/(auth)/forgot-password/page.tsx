import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { buttonStyles } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Password reset is being built next. For now, contact support and we will help you back in."
      footer={
        <Link href="/login" className="underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <a
        href={`mailto:${brand.supportEmail}?subject=Password%20reset`}
        className={buttonStyles({ className: "w-full" })}
      >
        Email {brand.supportEmail}
      </a>
      <p className="mt-4 text-xs text-muted-500">
        Self-service reset (email link, single-use token) ships with the buyer
        account work.
      </p>
    </AuthShell>
  );
}
