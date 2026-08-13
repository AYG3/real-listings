"use client";

import { FileText, Mail, MapPin, Phone, UserRound, X } from "lucide-react";
import type { Agent } from "./agent-data";

type AgentDetailsModalProps = {
  agent: Agent | null;
  mode: "all" | "pending";
  onClose: () => void;
};

const statusLabels = {
  active: "Active",
  pending: "Pending review",
  rejected: "Rejected",
};

export function AgentDetailsModal({
  agent,
  mode,
  onClose,
}: AgentDetailsModalProps) {
  if (!agent) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-details-title"
      onMouseDown={onClose}
    >
      <section
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
              Agent profile
            </p>
            <h2
              id="agent-details-title"
              className="mt-1 text-2xl font-bold tracking-tight text-gray-950"
            >
              Agent details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-950"
            aria-label="Close agent details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#114b3d] text-2xl font-bold text-white">
              {agent.initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-gray-950">{agent.name}</h3>
              <p className="mt-1 text-base font-medium text-gray-500">
                {mode === "pending" ? `Requested ${agent.requestedAt}` : statusLabels[agent.status]}
              </p>
            </div>
          </div>

          <dl className="mt-8 grid gap-4 border-y border-gray-100 py-6">
            <DetailRow icon={Mail} label="Email" value={agent.email} />
            <DetailRow icon={Phone} label="Phone" value={agent.phone} />
            <DetailRow
              icon={MapPin}
              label="Location"
              value={`${agent.city}, ${agent.state}`}
            />
            <DetailRow
              icon={UserRound}
              label="Business name"
              value={agent.businessName}
            />
            <DetailRow icon={UserRound} label="Signed up" value={agent.signedUp} />
          </dl>

          <div className="mt-6">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">
              ID verification
            </p>
            <button className="mt-3 flex min-h-14 w-full items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 text-left text-sm font-bold text-gray-900 transition-colors hover:bg-emerald-50">
              <FileText className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
              {agent.verificationDocument}
            </button>
          </div>
        </div>

        <footer className="grid gap-3 border-t border-gray-100 bg-gray-50 px-5 py-5 sm:grid-cols-2 sm:px-8">
          {mode === "pending" ? (
            <>
              <button
                type="button"
                className="h-12 rounded-md border border-emerald-200 bg-white px-4 text-sm font-bold text-[#114b3d] transition-colors hover:bg-emerald-50"
              >
                Approve
              </button>
              <button
                type="button"
                className="h-12 rounded-md border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50"
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="h-12 rounded-md border border-[#114b3d]/20 bg-[#114b3d] px-4 text-sm font-bold text-white transition-colors hover:bg-[#0d3b2f]"
              >
                View listings
              </button>
              <button
                type="button"
                className="h-12 rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Message agent
              </button>
            </>
          )}
        </footer>
      </section>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
      <dt className="flex items-center gap-3 text-sm font-semibold text-gray-500">
        <Icon className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
        {label}
      </dt>
      <dd className="min-w-0 break-words text-base font-semibold text-gray-950">
        {value}
      </dd>
    </div>
  );
}
