import BasicInformation from "@/app/admin/(protected)/upload/_components/basic-information";
import Location from "@/app/admin/(protected)/upload/_components/location";
import ListingDetails from "@/app/admin/(protected)/upload/_components/listing-details";
import { createListing } from "../../_components/actions";

export default function ListingForm() {
  return (
    <form
      action={createListing}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:p-8"
    >
      <BasicInformation />
      <Location />
      <ListingDetails />

      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#114b3d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d3b2f]"
        >
          Create Property
        </button>
      </div>
    </form>
  );
}
