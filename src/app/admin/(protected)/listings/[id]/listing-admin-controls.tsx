"use client";

import { useState, useTransition } from "react";
import { Archive, Check, RotateCcw } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  archiveListing,
  decideListing,
  restoreListing,
} from "../../moderation/actions";

type Props = {
  listingId: string;
  status: string;
  title: string;
};

/**
 * Admin actions for a single listing. Publishing is reversible and cheap;
 * archiving hides it from the public site, so it asks the operator to type the
 * word before it fires.
 */
export function ListingAdminControls({ listingId, status, title }: Props) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );
  const [confirming, setConfirming] = useState(false);

  const run = (work: () => Promise<{ status: string; message: string }>) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await work();
      setFeedback({
        tone: result.status === "error" ? "error" : "success",
        text: result.message,
      });
    });
  };

  const archived = status === "ARCHIVED";

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        {status === "DRAFT" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => decideListing(listingId, "APPROVED"))}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-forest-700 px-5 text-sm font-bold text-white transition-colors hover:bg-forest-800 disabled:opacity-60"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {pending ? "Working…" : "Approve & publish"}
          </button>
        ) : null}

        {archived ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => restoreListing(listingId))}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Restore to draft
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirming(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-5 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60"
          >
            <Archive className="h-4 w-4" aria-hidden="true" />
            Archive listing
          </button>
        )}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-4 text-sm font-semibold ${
          feedback?.tone === "error" ? "text-rose-700" : "text-forest-700"
        }`}
      >
        {feedback?.text ?? ""}
      </p>

      <ConfirmDialog
        open={confirming}
        title="Archive this listing?"
        description={`"${title}" disappears from the public site and from search. The agent keeps the record and can restore it.`}
        phrase="ARCHIVE"
        confirmLabel="Archive listing"
        pending={pending}
        onConfirm={() => {
          setConfirming(false);
          run(() => archiveListing(listingId));
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
