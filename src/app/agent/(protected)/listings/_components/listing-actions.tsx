"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Archive, Check, Eye, Pencil, RotateCcw, Tag, X } from "lucide-react";
import { updateListingStatus } from "../actions";
import type { ListingStatus } from "./listing-data";

type Action = {
  label: string;
  status: ListingStatus;
  icon: typeof Eye;
  tone: "primary" | "secondary";
};

const transitions: Record<ListingStatus, Action[]> = {
  DRAFT: [
    { label: "Publish", status: "PUBLISHED", icon: Check, tone: "primary" },
    { label: "Archive", status: "ARCHIVED", icon: Archive, tone: "secondary" },
  ],
  PUBLISHED: [
    { label: "Mark under offer", status: "UNDER_OFFER", icon: Tag, tone: "secondary" },
    { label: "Mark sold", status: "SOLD", icon: Check, tone: "secondary" },
    { label: "Unpublish", status: "DRAFT", icon: X, tone: "secondary" },
  ],
  UNDER_OFFER: [
    { label: "Mark sold", status: "SOLD", icon: Check, tone: "secondary" },
    { label: "Back to live", status: "PUBLISHED", icon: RotateCcw, tone: "secondary" },
  ],
  SOLD: [
    { label: "Back to live", status: "PUBLISHED", icon: RotateCcw, tone: "secondary" },
    { label: "Archive", status: "ARCHIVED", icon: Archive, tone: "secondary" },
  ],
  RENTED: [
    { label: "Back to live", status: "PUBLISHED", icon: RotateCcw, tone: "secondary" },
    { label: "Archive", status: "ARCHIVED", icon: Archive, tone: "secondary" },
  ],
  ARCHIVED: [{ label: "Restore to draft", status: "DRAFT", icon: RotateCcw, tone: "secondary" }],
};

const tones = {
  primary:
    "bg-forest-700 text-white hover:bg-forest-800 focus-visible:outline-forest-700",
  secondary:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-gray-400",
};

export function ListingActions({
  listingId,
  status,
  slug,
  isPublic,
}: {
  listingId: string;
  status: ListingStatus;
  slug: string;
  isPublic: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const run = (next: ListingStatus) => {
    setFeedback(null);
    startTransition(async () => {
      // revalidatePath inside the action already re-renders this route; a
      // second router.refresh() here only keeps the transition open.
      const result = await updateListingStatus(listingId, next);
      setFeedback({
        tone: result.status === "error" ? "error" : "success",
        text: result.message,
      });
    });
  };

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {isPublic ? (
          <Link
            href={`/properties/${slug}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            View
          </Link>
        ) : null}

        <Link
          href={`/agent/listings/${listingId}/edit`}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </Link>

        {transitions[status].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.status}
              type="button"
              onClick={() => run(action.status)}
              disabled={pending}
              className={`inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${tones[action.tone]}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {action.label}
            </button>
          );
        })}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-4 text-xs font-semibold ${
          feedback?.tone === "error" ? "text-rose-700" : "text-forest-700"
        }`}
      >
        {pending ? "Saving…" : feedback?.text ?? ""}
      </p>
    </div>
  );
}
