"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Clock3, MessageSquare, Search, XCircle } from "lucide-react";
import { updateInquiry } from "../actions";
import { MaskedValue } from "@/components/demo/masked-value";
import type { InquiryRow, InquiryStatusValue } from "./inquiry-data";

const statusMeta: Record<
  InquiryStatusValue,
  { label: string; className: string; icon: typeof MessageSquare }
> = {
  NEW: { label: "New", className: "bg-forest-700 text-white", icon: MessageSquare },
  CONTACTED: { label: "Contacted", className: "bg-amber-100 text-amber-900", icon: Clock3 },
  VIEWING_SCHEDULED: {
    label: "Viewing scheduled",
    className: "bg-blue-100 text-blue-900",
    icon: CheckCircle2,
  },
  CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-600", icon: XCircle },
};

const nextStatuses: Record<InquiryStatusValue, InquiryStatusValue[]> = {
  NEW: ["CONTACTED", "VIEWING_SCHEDULED", "CLOSED"],
  CONTACTED: ["VIEWING_SCHEDULED", "CLOSED", "NEW"],
  VIEWING_SCHEDULED: ["CLOSED", "CONTACTED"],
  CLOSED: ["NEW"],
};

export function InquiryInbox({
  inquiries,
  redacted = false,
}: {
  inquiries: InquiryRow[];
  redacted?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InquiryStatusValue | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(inquiries[0]?.id ?? null);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );
  const [noteDraft, setNoteDraft] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      const matchesStatus = filter === "all" || inquiry.status === filter;
      const haystack = [
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.message,
        inquiry.listingTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [inquiries, query, filter]);

  const active = filtered.find((inquiry) => inquiry.id === activeId) ?? filtered[0] ?? null;

  const act = (inquiryId: string, status: InquiryStatusValue) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateInquiry(inquiryId, status, noteDraft || undefined);
      setFeedback({
        tone: result.status === "error" ? "error" : "success",
        text: result.message,
      });
      if (result.status === "success") setNoteDraft("");
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <label className="flex h-12 items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500 focus-within:border-forest-700/35 focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search buyer, message, or listing"
              className="min-w-0 flex-1 bg-transparent text-gray-950 outline-none placeholder:text-gray-400"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            {(["all", "NEW", "CONTACTED", "VIEWING_SCHEDULED", "CLOSED"] as const).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={`h-9 rounded-md px-3 text-xs font-bold transition-colors ${
                    filter === value
                      ? "bg-forest-700 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {value === "all" ? "All" : statusMeta[value].label}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm font-medium text-gray-500">
              Nothing matches that filter yet. New enquiries from your listings
              land here.
            </p>
          ) : (
            filtered.map((inquiry) => {
              const meta = statusMeta[inquiry.status];
              const isActive = active?.id === inquiry.id;
              return (
                <button
                  key={inquiry.id}
                  type="button"
                  onClick={() => {
                    setActiveId(inquiry.id);
                    setNoteDraft("");
                    setFeedback(null);
                  }}
                  aria-current={isActive}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    isActive
                      ? "border-forest-700/45 bg-emerald-50/60"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-bold text-gray-950">
                      {inquiry.name ?? "Buyer"}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs font-semibold text-gray-500">
                    {inquiry.listingTitle}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {inquiry.message}
                  </p>
                  <p className="mt-2 text-xs font-medium text-gray-600">
                    {inquiry.age}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div>
        {active ? (
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-950">
                  {active.name ?? "Buyer"}
                </h2>
                <p className="mt-1 text-xs font-semibold text-gray-500">
                  {active.listingTitle}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusMeta[active.status].className}`}
              >
                {statusMeta[active.status].label}
              </span>
            </div>

            <dl className="mt-4 grid gap-2 text-sm">
              {active.email ? (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 font-semibold text-gray-500">Email</dt>
                  <dd className="min-w-0 break-all">
                    {redacted ? (
                      <MaskedValue value={active.email} />
                    ) : (
                      <a
                        className="text-forest-700 underline"
                        href={`mailto:${active.email}`}
                      >
                        {active.email}
                      </a>
                    )}
                  </dd>
                </div>
              ) : null}
              {active.phone ? (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 font-semibold text-gray-500">Phone</dt>
                  <dd>
                    {redacted ? (
                      <MaskedValue value={active.phone} />
                    ) : (
                      <a
                        className="text-forest-700 underline"
                        href={`tel:${active.phone}`}
                      >
                        {active.phone}
                      </a>
                    )}
                  </dd>
                </div>
              ) : null}
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 font-semibold text-gray-500">Received</dt>
                <dd>{active.age}</dd>
              </div>
            </dl>

            <p className="mt-4 whitespace-pre-line rounded-control bg-gray-50 p-3 text-sm text-gray-700">
              {active.message}
            </p>

            {active.agentNote ? (
              <div className="mt-3 rounded-control border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <p className="text-xs font-bold uppercase tracking-wide">Your note</p>
                <p className="mt-1 whitespace-pre-line">{active.agentNote}</p>
              </div>
            ) : null}

            <label className="mt-4 block text-sm font-semibold text-gray-700">
              Reply note
              <textarea
                value={noteDraft}
                onChange={(event) => setNoteDraft(event.target.value)}
                rows={3}
                placeholder="What did you tell the buyer? Saved with the status change."
                className="mt-1 w-full rounded-control border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-forest-700"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {nextStatuses[active.status].map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={pending}
                  onClick={() => act(active.id, status)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  {statusMeta[status].label}
                </button>
              ))}
            </div>

            <p
              role="status"
              aria-live="polite"
              className={`mt-3 min-h-4 text-xs font-semibold ${
                feedback?.tone === "error" ? "text-rose-700" : "text-forest-700"
              }`}
            >
              {pending ? "Saving…" : feedback?.text ?? ""}
            </p>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm font-medium text-gray-500">
            Select an enquiry to see the buyer&apos;s details.
          </p>
        )}
      </div>
    </div>
  );
}
