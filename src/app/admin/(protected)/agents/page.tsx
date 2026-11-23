import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock3, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getVerificationQueue } from "@/lib/admin/moderation";
import { isDemoSessionUser } from "@/lib/demo/guard";
import { redactVerificationAgent } from "@/lib/demo/redact";
import { VerificationList } from "../moderation/_components/verification-list";

const statusOrder = ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"];

export default async function AgentsPage() {
  const session = await requireAdmin();
  const redact = isDemoSessionUser(session.user);
  const agents = (await getVerificationQueue()).map((agent) =>
    redact ? redactVerificationAgent(agent) : agent,
  );

  const counts = {
    total: agents.length,
    verified: agents.filter((agent) => agent.agentStatus === "VERIFIED").length,
    pending: agents.filter((agent) => agent.agentStatus === "PENDING").length,
  };

  return (
    <div className="bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 lg:block">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Agents
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Every agent account with its verification state and listing
              activity. Verify or reject here — the decision is audited.
            </p>
          </div>

          <Link
            href="/admin/moderation?tab=agents"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-forest-700/20 bg-white px-4 text-sm font-bold text-forest-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Moderation queue
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              <Users className="h-4 w-4" aria-hidden="true" />
              Total agents
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-950">{counts.total}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Verified
            </p>
            <p className="mt-2 text-3xl font-bold text-forest-700">{counts.verified}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              Pending review
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-700">{counts.pending}</p>
          </div>
        </section>

        <section className="mt-8">
          {agents.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-medium text-gray-500">
              No agent accounts yet.
            </p>
          ) : (
            <VerificationList
              redacted={redact}
              agents={[...agents].sort(
                (a, b) =>
                  statusOrder.indexOf(a.agentStatus ?? "PENDING") -
                    statusOrder.indexOf(b.agentStatus ?? "PENDING") ||
                  a.name.localeCompare(b.name),
              )}
            />
          )}
        </section>
      </div>
    </div>
  );
}
