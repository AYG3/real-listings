import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { ArrowUpRight, Building2, Clock3, Flag, Plus } from "lucide-react";
import { ListingList } from "./_components/listing-list";
import type { AdminListing } from "./_components/listing-data";
import prisma from "@/lib/prisma";
import { SummaryCard } from "@/components/ui/card";
import { formatPrice, formatRelativeTime } from "@/lib/format";

const coverToneByStatus: Record<string, AdminListing["coverTone"]> = {
  PUBLISHED: "green",
  DRAFT: "gray",
  UNDER_OFFER: "amber",
  ARCHIVED: "rose",
};

export default async function ListingsPage() {
  await requireAdmin();

  const rawListings = await prisma.listing.findMany({
    include: {
      images: { orderBy: { order: "asc" } },
      agent: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const listings: AdminListing[] = rawListings.map((listing) => {
    const attrs = listing.attributes as Record<string, unknown> | null;
    return {
      id: listing.id,
      title: listing.title,
      type: listing.type as AdminListing["type"],
      status: listing.status as AdminListing["status"],
      price: formatPrice(listing.price, listing.currency),
      city: listing.city,
      state: listing.state,
      address: listing.address,
      agent: listing.agent.name,
      submittedAt: formatRelativeTime(listing.createdAt),
      publishedAt:
        listing.status === "PUBLISHED"
          ? formatRelativeTime(listing.updatedAt)
          : undefined,
      bedrooms: attrs?.bedrooms as number | undefined,
      bathrooms: attrs?.bathrooms as number | undefined,
      size: (attrs?.size as string) ?? "-",
      coverTone: coverToneByStatus[listing.status] ?? "gray",
      description: listing.description,
      amenities: (attrs?.amenities as string[]) ?? [],
      images: listing.images.map((img) => ({ url: img.url })),
    };
  });

  const pendingListings = listings.filter((l) => l.status === "DRAFT");
  const flaggedCount = listings.filter((l) => l.status === "ARCHIVED").length;

  return (
    <div className="bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 lg:block">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Review, search, and manage all property listings submitted by
              agents.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/listings/pending"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-forest-700/20 bg-white px-4 text-sm font-bold text-forest-700 shadow-sm transition-colors hover:bg-emerald-50"
            >
              Pending listings
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/admin/upload"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-forest-700 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-forest-800"
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
    </div>
  );
}
