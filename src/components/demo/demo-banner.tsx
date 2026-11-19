import Link from "next/link";
import { Lock } from "lucide-react";
import { getSession } from "@/lib/auth/guards";
import { isDemoSessionUser } from "@/lib/demo/guard";

/**
 * Shown on every page for a read-only demo session. Server-rendered so it is
 * present before hydration.
 */
export async function DemoBanner() {
  const session = await getSession();

  if (!isDemoSessionUser(session?.user)) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-900"
    >
      <span className="inline-flex flex-wrap items-center justify-center gap-2">
        <Lock className="h-4 w-4" aria-hidden="true" />
        Read-only demo — everything is open, nothing can be changed.{" "}
        <Link href="/demo" className="underline underline-offset-2">
          Switch role
        </Link>
      </span>
    </div>
  );
}
