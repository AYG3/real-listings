import Link from "next/link";
import { ArrowUpRight, Building2, Clock3, Flag, Plus } from "lucide-react";
import { ListingList } from "./_components/listing-list";
import { listings, pendingListings } from "./_components/listing-data";

const flaggedCount = listings.filter((listing) => listing.status === "flagged").length;

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Review, search, and manage all property listings submitted by agents.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/listings/pending"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#114b3d]/20 bg-white px-4 text-sm font-bold text-[#114b3d] shadow-sm transition-colors hover:bg-emerald-50"
            >
              Pending listings
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/admin/upload"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#114b3d] px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3b2f]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add listing
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Building2}
            label="Total listings"
            value={String(listings.length)}
            detail="All inventory"
          />
          <SummaryCard
            icon={Clock3}
            label="Pending review"
            value={String(pendingListings.length)}
            detail="Awaiting publish"
          />
          <SummaryCard
            icon={Flag}
            label="Flagged"
            value={String(flaggedCount)}
            detail="Needs attention"
          />
        </section>

        <section className="mt-8">
          <ListingList listings={listings} mode="all" />
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-[#114b3d]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="text-xs font-bold text-gray-500">{detail}</p>
      </div>
      <p className="mt-6 text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
        {value}
      </p>
    </article>
  );
}
