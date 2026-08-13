import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { ListingList } from "../_components/listing-list";
import { pendingListings } from "../_components/listing-data";

export default function PendingListingsPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
              Listings
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Pending listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Review new submissions before they become visible to buyers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="inline-flex h-14 items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 text-amber-700">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="text-xl font-bold leading-none">
                  {pendingListings.length}
                </p>
                <p className="text-xs font-bold">waiting</p>
              </div>
            </div>

            <Link
              href="/admin/listings"
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#114b3d] hover:text-[#0d3b2f]"
            >
              View all listings
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className="mt-8">
          <ListingList listings={pendingListings} mode="pending" />
        </section>
      </div>
    </main>
  );
}
