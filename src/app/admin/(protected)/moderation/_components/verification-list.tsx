"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, ShieldX } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { decideAgent } from "../actions";
import type { VerificationAgent } from "@/lib/admin/moderation";

const statusStyles: Record<string, string> = {
  VERIFIED: "bg-emerald-100 text-forest-800",
  PENDING: "bg-amber-100 text-amber-900",
  REJECTED: "bg-rose-100 text-rose-800",
  SUSPENDED: "bg-gray-200 text-gray-700",
};

function joined(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function VerificationList({ agents }: { agents: VerificationAgent[] }) {
  const [pending, startTransition] = useTransition();
  const [reasonFor, setReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );
  const [confirming, setConfirming] = useState<{ agentId: string; name: string } | null>(
    null,
  );

  const act = (agentId: string, decision: "VERIFIED" | "REJECTED") => {
    setFeedback(null);
    startTransition(async () => {
      const result = await decideAgent(
        agentId,
        decision,
        reasonFor === agentId ? reason : undefined,
      );
      setFeedback({
        tone: result.status === "error" ? "error" : "success",
        text: result.message,
      });
      if (result.status === "success") {
        setReason("");
        setReasonFor(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <p
        role="status"
        aria-live="polite"
        className={`min-h-4 text-sm font-semibold ${
          feedback?.tone === "error" ? "text-rose-700" : "text-forest-700"
        }`}
      >
        {pending ? "Saving…" : feedback?.text ?? ""}
      </p>

      {agents.map((agent) => (
        <article
          key={agent.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-950">{agent.name}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    statusStyles[agent.agentStatus ?? "PENDING"] ?? statusStyles.PENDING
                  }`}
                >
                  {agent.agentStatus ?? "PENDING"}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-600">
                {agent.agencyName ?? "No agency name"} · {agent.email}
                {agent.phone ? ` · ${agent.phone}` : ""}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500">
                Joined {joined(agent.createdAt)} · {agent.listingCount} listing
                {agent.listingCount === 1 ? "" : "s"} ({agent.publishedCount} published)
              </p>
              {agent.bio ? (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{agent.bio}</p>
              ) : null}
              {agent.agentStatusReason ? (
                <p className="mt-2 rounded border-l-2 border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
                  Last decision note: {agent.agentStatusReason}
                </p>
              ) : null}
            </div>

            <div className="w-full shrink-0 space-y-2 sm:w-72">
              <label className="block text-xs font-semibold text-gray-600">
                Reason (required to reject)
                <input
                  value={reasonFor === agent.id ? reason : ""}
                  onChange={(event) => {
                    setReasonFor(agent.id);
                    setReason(event.target.value);
                  }}
                  placeholder="Why is this account being rejected?"
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-forest-700"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => act(agent.id, "VERIFIED")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-forest-700 px-3 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-60"
                >
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verify
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setConfirming({ agentId: agent.id, name: agent.name })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-rose-300 bg-white px-3 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                >
                  <ShieldX className="h-3.5 w-3.5" aria-hidden="true" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}

      <ConfirmDialog
        open={confirming !== null}
        title={`Reject ${confirming?.name ?? "this agent"}?`}
        description="Their listings stop being publishable and the reason is shown to them. The decision is written to the audit log."
        phrase="REJECT"
        confirmLabel="Reject agent"
        pending={pending}
        onConfirm={() => {
          const target = confirming;
          setConfirming(null);
          if (target) act(target.agentId, "REJECTED");
        }}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
