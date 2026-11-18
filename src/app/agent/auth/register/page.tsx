import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { buttonStyles } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata = { title: "Become an agent" };

export default function AgentRegisterPage() {
  return (
    <AuthShell
      title="Become an agent"
      subtitle="Agent onboarding is being built next. Here is what it will do."
      footer={
        <Link href="/login" className="underline underline-offset-4">
          Already registered? Sign in
        </Link>
      }
    >
      <ol className="space-y-3 text-sm text-ink-700">
        <li className="rounded-control border border-ink-900/10 bg-white p-3">
          <span className="font-semibold text-ink-900">1. Apply</span> — agency
          details, contact information, and a verification document.
        </li>
        <li className="rounded-control border border-ink-900/10 bg-white p-3">
          <span className="font-semibold text-ink-900">2. Get verified</span> — a{" "}
          {brand.name} admin reviews your documents before your listings go live.
        </li>
        <li className="rounded-control border border-ink-900/10 bg-white p-3">
          <span className="font-semibold text-ink-900">3. List and respond</span> —
          publish properties and manage buyer enquiries from your dashboard.
        </li>
      </ol>

      <p className="mt-5 text-xs text-muted-500">
        Applications are reviewed within one business day.
      </p>

      <a
        href={`mailto:${brand.supportEmail}?subject=Agent%20application`}
        className={buttonStyles({ className: "mt-5 w-full" })}
      >
        Request early access
      </a>
    </AuthShell>
  );
}
