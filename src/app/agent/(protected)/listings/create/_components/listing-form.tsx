import Link from "next/link";
import BasicInformation from "@/app/admin/(protected)/upload/_components/basic-information";
import Location from "@/app/admin/(protected)/upload/_components/location";
import ListingDetails from "@/app/admin/(protected)/upload/_components/listing-details";
import { buttonStyles } from "@/components/ui/button";
import { createListing } from "../../_components/actions";

export default function ListingForm() {
  return (
    <form
      action={createListing}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:p-8"
    >
      <BasicInformation showStatus={false} />
      <Location />
      <ListingDetails />

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

        <button type="submit" className={buttonStyles()}>
          Create Property
        </button>
      </div>
    </form>
  );
}
