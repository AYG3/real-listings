import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { AgentList } from "../_components/agent-list";
import { pendingAgents } from "../_components/agent-data";

export default function PendingAgentsPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
              Agents
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Pending agent approvals
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Verify new agent applications before they can publish listings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="inline-flex h-14 items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 text-rose-700">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="text-xl font-bold leading-none">
                  {pendingAgents.length}
                </p>
                <p className="text-xs font-bold">waiting</p>
              </div>
            </div>

            <Link
              href="/admin/agents"
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#114b3d] hover:text-[#0d3b2f]"
            >
              View all agents
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className="mt-8">
          <AgentList agents={pendingAgents} mode="pending" />
        </section>
      </div>
    </main>
  );
}
