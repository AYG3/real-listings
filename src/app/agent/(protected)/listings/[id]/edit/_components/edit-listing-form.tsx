"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ReactNode } from "react";
import ListingFields from "@/app/admin/(protected)/upload/_components/listing-fields";
import { buttonStyles } from "@/components/ui/button";
import { updateListing, type UpdateListingState } from "../actions";

const initialState: UpdateListingState = { status: "idle" };

type ListingFieldDefaults = Parameters<typeof ListingFields>[0]["defaults"];

export function EditListingForm({
  listingId,
  defaults,
  media,
}: {
  listingId: string;
  defaults?: ListingFieldDefaults;
  /** Image manager plus uploader, rendered in place of the create-only uploader. */
  media?: ReactNode;
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
        </p>
      ) : null}

      <ListingFields
        defaults={defaults}
        fieldErrors={state.fieldErrors}
        media={media}
      />

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
