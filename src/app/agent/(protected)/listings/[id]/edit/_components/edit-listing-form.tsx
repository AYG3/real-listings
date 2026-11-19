"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ReactNode } from "react";
import { buttonStyles } from "@/components/ui/button";
import { updateListing, type UpdateListingState } from "../actions";

const initialState: UpdateListingState = { status: "idle" };

export function EditListingForm({
  listingId,
  children,
}: {
  listingId: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(
    updateListing.bind(null, listingId),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:p-8"
    >
      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-control border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger"
        >
          {state.message}
          {state.fieldErrors ? (
            <span className="mt-1 block font-normal">
              {Object.values(state.fieldErrors).join(" · ")}
            </span>
          ) : null}
        </p>
      ) : null}

      {children}

      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/agent/listings"
          className={buttonStyles({ variant: "secondary" })}
        >
          Cancel
        </Link>

        <button type="submit" disabled={pending} className={buttonStyles()}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
