"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clock3,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import type { Agent, AgentStatus } from "./agent-data";
import { AgentDetailsModal } from "./agent-details-modal";

type AgentListProps = {
  agents: Agent[];
  mode: "all" | "pending";
};

const statusStyles: Record<AgentStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-[#114b3d]",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusLabels: Record<AgentStatus, string> = {
  active: "Active",
  pending: "Pending",
  rejected: "Rejected",
};

export function AgentList({ agents, mode }: AgentListProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [query, setQuery] = useState("");

  const filteredAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return agents;
    }

    return agents.filter((agent) =>
      [agent.name, agent.email, agent.city, agent.state, agent.businessName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [agents, query]);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <label className="flex h-12 items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500 focus-within:border-[#114b3d]/35 focus-within:bg-white">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search agents"
            className="min-w-0 flex-1 bg-transparent text-gray-950 outline-none placeholder:text-gray-400"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4">
        {filteredAgents.map((agent) => (
          <button
            type="button"
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className="group rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-[#114b3d]/35 hover:bg-emerald-50/40 sm:p-5"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#114b3d] text-lg font-bold text-white">
                  {agent.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-950">
                      {agent.name}
                    </h2>
                    {mode === "all" ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[agent.status]}`}
                      >
                        {statusLabels[agent.status]}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-gray-500">
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{agent.email}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {agent.city}, {agent.state}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">
                      {agent.businessName}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">
                      {mode === "pending"
                        ? `Requested ${agent.requestedAt}`
                        : `${agent.listings} listings`}
                    </span>
                    {mode === "all" ? (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1">
                        Rating {agent.rating}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:justify-end">
                {mode === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-white px-4 text-sm font-bold text-[#114b3d] transition-colors hover:bg-emerald-50"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="grid min-w-52 grid-cols-3 gap-2 rounded-md border border-gray-200 bg-gray-50 p-2 text-center">
                    <AgentMetric
                      icon={ShieldCheck}
                      label="Status"
                      value={statusLabels[agent.status]}
                    />
                    <AgentMetric
                      icon={UserRound}
                      label="Listings"
                      value={String(agent.listings)}
                    />
                    <AgentMetric
                      icon={Clock3}
                      label="Joined"
                      value={agent.signedUp.split(",")[0]}
                    />
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <AgentDetailsModal
        agent={selectedAgent}
        mode={mode}
        onClose={() => setSelectedAgent(null)}
      />
    </>
  );
}

function AgentMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <Icon className="mx-auto h-4 w-4 text-[#114b3d]" aria-hidden="true" />
      <p className="mt-1 truncate text-[11px] font-semibold text-gray-500">
        {label}
      </p>
      <p className="truncate text-xs font-bold text-gray-950">{value}</p>
    </div>
  );
}
