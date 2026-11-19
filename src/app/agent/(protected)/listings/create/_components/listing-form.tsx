"use client";

import Link from "next/link";
import { useActionState } from "react";
import ListingFields from "@/app/admin/(protected)/upload/_components/listing-fields";
import { buttonStyles } from "@/components/ui/button";
import { createListing, type CreateListingState } from "../../_components/actions";

const initialState: CreateListingState = { status: "idle" };

export default function ListingForm() {
  const [state, formAction, pending] = useActionState(createListing, initialState);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:p-8"
    >
      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-control border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger"
        >
          {state.message}
        </p>
      ) : null}

      <ListingFields fieldErrors={state.fieldErrors} />

      <p className="text-sm text-muted-500">
        Your listing is submitted for review and goes live once an admin
        approves it.
      </p>

      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/agent/listings"
          className={buttonStyles({ variant: "secondary" })}
        >
          Cancel
        </Link>

        <button type="submit" disabled={pending} className={buttonStyles()}>
          {pending ? "Creating…" : "Create Property"}
        </button>
      </div>
    </form>
  );
}
