import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock3 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getModerationQueue, getVerificationQueue } from "@/lib/admin/moderation";
import { ModerationQueue } from "./_components/moderation-queue";
import { VerificationList } from "./_components/verification-list";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminModerationPage({ searchParams }: PageProps) {
  await requireAdmin();
  const tab = (await searchParams).tab === "agents" ? "agents" : "listings";

  const [listings, agents] = await Promise.all([
    getModerationQueue(),
    getVerificationQueue(),
  ]);

  const pendingAgents = agents.filter((agent) => agent.agentStatus === "PENDING");

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Moderation
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Everything here writes an audit entry, so the decision trail stays
              with the record.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="inline-flex h-14 items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 text-amber-700">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="text-xl font-bold leading-none">{listings.length}</p>
                <p className="text-xs font-bold">listings</p>
              </div>
            </div>
            <div className="inline-flex h-14 items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-forest-700">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="text-xl font-bold leading-none">{pendingAgents.length}</p>
                <p className="text-xs font-bold">agents</p>
              </div>
            </div>
          </div>
        </header>

        <nav aria-label="Moderation sections" className="mt-6 flex gap-2">
          <Link
            href="/admin/moderation"
            aria-current={tab === "listings"}
            className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold ${
              tab === "listings"
                ? "bg-forest-700 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Listings ({listings.length})
          </Link>
          <Link
            href="/admin/moderation?tab=agents"
            aria-current={tab === "agents"}
            className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold ${
              tab === "agents"
                ? "bg-forest-700 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Agents ({pendingAgents.length})
          </Link>
          <Link
            href="/admin/audit"
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-forest-700 hover:bg-gray-50"
          >
            Audit log
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>

        <section className="mt-6">
          {tab === "listings" ? (
            <ModerationQueue listings={listings} />
          ) : pendingAgents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <BadgeCheck className="mx-auto h-8 w-8 text-forest-700" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold text-gray-950">
                No agents awaiting verification
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                New agent accounts appear here with their profile details.
              </p>
            </div>
          ) : (
            <VerificationList agents={pendingAgents} />
          )}
        </section>
      </div>
    </main>
  );
}
