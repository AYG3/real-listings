"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, ExternalLink, MessageSquareWarning, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { decideListing } from "../actions";
import type { ModerationListing } from "@/lib/admin/moderation";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function relative(date: Date) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function ModerationQueue({ listings }: { listings: ModerationListing[] }) {
  const [pending, startTransition] = useTransition();
  const [reasonFor, setReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );
  const [decided, setDecided] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState<{ listingId: string } | null>(null);

  const act = (
    listingId: string,
    decision: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
  ) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await decideListing(
        listingId,
        decision,
        reasonFor === listingId ? reason : undefined,
      );
      setFeedback({
        tone: result.status === "error" ? "error" : "success",
        text: result.message,
      });
      if (result.status === "success") {
        setDecided((current) => ({ ...current, [listingId]: decision }));
        setReason("");
        setReasonFor(null);
      }
    });
  };

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <Check className="mx-auto h-8 w-8 text-forest-700" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-gray-950">Queue is clear</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          Nothing is waiting for review. New agent submissions land here as
          drafts.
        </p>
      </div>
    );
  }

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

      {listings.map((listing) => {
        const outcome = decided[listing.id];
        return (
          <article
            key={listing.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md bg-gray-100 lg:h-24 lg:w-36">
                {listing.cover ? (
                  <Image
                    src={listing.cover}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold text-gray-400">
                    No photo
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-950">{listing.title}</h2>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                    Draft
                  </span>
                  {listing.rejectionReason ? (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">
                      Changes requested
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-600">
                  {currency.format(Number(listing.price))} · {listing.type.toLowerCase()} ·{" "}
                  {listing.intent === "RENT" ? "for rent" : "for sale"} · {listing.city},{" "}
                  {listing.state}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  {listing.agentName} ({listing.agentEmail}) ·{" "}
                  {listing.agentStatus === "VERIFIED" ? "verified agent" : "unverified"} ·
                  submitted {relative(listing.submittedAt)}
                </p>

                {listing.rejectionReason ? (
                  <p className="mt-2 rounded border-l-2 border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
                    Previous feedback: {listing.rejectionReason}
                  </p>
                ) : null}

                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                  {listing.description}
                </p>

                {outcome ? (
                  <p className="mt-3 text-sm font-bold text-forest-700">
                    {outcome === "APPROVED"
                      ? "Approved — now live."
                      : outcome === "REJECTED"
                        ? "Rejected."
                        : "Changes requested."}
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    <label className="block text-xs font-semibold text-gray-600">
                      Reason (required for reject / changes)
                      <input
                        value={reasonFor === listing.id ? reason : ""}
                        onChange={(event) => {
                          setReasonFor(listing.id);
                          setReason(event.target.value);
                        }}
                        placeholder="What does the agent need to fix?"
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-forest-700"
                      />
                    </label>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => act(listing.id, "APPROVED")}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-forest-700 px-3 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-60"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Approve &amp; publish
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => act(listing.id, "CHANGES_REQUESTED")}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 text-xs font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-60"
                      >
                        <MessageSquareWarning className="h-3.5 w-3.5" aria-hidden="true" />
                        Request changes
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirming({ listingId: listing.id })}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-rose-300 bg-white px-3 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        Reject
                      </button>
                      <Link
                        href={`/admin/listings/${listing.id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        Full record
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      <ConfirmDialog
        open={confirming !== null}
        title="Reject this listing?"
        description="The agent keeps the record but it cannot be submitted again without changes. The reason you typed above is attached to the decision."
        phrase="REJECT"
        confirmLabel="Reject listing"
        pending={pending}
        onConfirm={() => {
          const target = confirming;
          setConfirming(null);
          if (target) act(target.listingId, "REJECTED");
        }}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
