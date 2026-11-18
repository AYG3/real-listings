"use client"
import BasicInformation from "./basic-information";
import Location from "./location";
import PropertyDetails from "./listing-details";
import { createListing, type CreateListingState } from "@/lib/admin/upload";
import { useActionState } from "react";

export default function ListingForm() {

  const [state, formAction, isPending] = useActionState(createListing, null as CreateListingState)


  return (
    <form
      action={formAction}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:p-8"
    >
      <BasicInformation />
      <Location />
      <PropertyDetails />

      {state?.error ? (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.error}
        </p>
      ) : null}

      {state?.success ? (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-forest-700">
          {state.success}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border text-black border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
        >
          {isPending ? "Loading" : "Create Property"}
        </button>
      </div>
    </form>
  );
}
