import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { ArrowUpRight, Clock3, UserRound, Users } from "lucide-react";
import { AgentList } from "./_components/agent-list";
import { agents, pendingAgents } from "./_components/agent-data";
import { SummaryCard } from "@/components/ui/card";

const activeAgentCount = agents.filter((agent) => agent.status === "active").length;

export default async function AgentsPage() {
  await requireAdmin();
  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Agents
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Review agent profiles, verification status, and listing activity.
            </p>
          </div>

          <Link
            href="/admin/agents/pending"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-forest-700/20 bg-white px-4 text-sm font-bold text-forest-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            Pending approvals
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Users}
            label="Total agents"
            value={String(agents.length)}
            detail="Across all markets"
          />
          <SummaryCard
            icon={UserRound}
            label="Active agents"
            value={String(activeAgentCount)}
            detail="Approved profiles"
          />
          <SummaryCard
            icon={Clock3}
            label="Pending review"
            value={String(pendingAgents.length)}
            detail="Awaiting approval"
          />
        </section>

        <section className="mt-8">
          <AgentList agents={agents} mode="all" />
        </section>
      </div>
    </main>
  );
}
