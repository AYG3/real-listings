"use client"
import BasicInformation from "./basic-information";
import Location from "./location";
import PropertyDetails from "./listing-details";
import { createListing, type CreateListingState } from "@/lib/admin/upload";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

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
          className="rounded-lg bg-[#114b3d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d3b2f]"
        >
          {isPending ? "Loading" : "Create Property"}
        </button>
      </div>
    </form>
  );
}
