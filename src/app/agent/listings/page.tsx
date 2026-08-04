import Link from "next/link";
import { Building2, CheckCircle2, Clock3, Plus } from "lucide-react";
import { ListingList } from "./_components/listing-list";
import { listings, pendingListings, activeListings } from "./_components/listing-data";

export default function AgentListingsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
              Agent
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              My Listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Manage your property listings — create, edit, and track their status.
            </p>
          </div>

          <Link
            href="/agent/listings/create"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#114b3d] px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3b2f]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Listing
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Building2}
            label="Total listings"
            value={String(listings.length)}
            detail="All time"
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Active listings"
            value={String(activeListings.length)}
            detail="Live on site"
          />
          <SummaryCard
            icon={Clock3}
            label="Pending approval"
            value={String(pendingListings.length)}
            detail="Awaiting review"
          />
        </section>

        <section className="mt-8">
          <ListingList listings={listings} />
        </section>
      </div>
    </div>
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