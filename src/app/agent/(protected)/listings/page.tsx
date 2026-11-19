import Link from "next/link";
import { Building2, CheckCircle2, Clock3, Eye, Plus } from "lucide-react";
import { ListingList } from "./_components/listing-list";
import type { AgentListing } from "./_components/listing-data";
import prisma from "@/lib/prisma";
import { SummaryCard } from "@/components/ui/card";
import { requireAgent } from "@/lib/auth/guards";
import { formatRelativeTime, formatPrice } from "@/lib/format";

const coverToneByStatus: Record<string, AgentListing["coverTone"]> = {
  PUBLISHED: "green",
  DRAFT: "gray",
  UNDER_OFFER: "amber",
  ARCHIVED: "rose",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AgentListingsPage({ searchParams }: PageProps) {
  const session = await requireAgent();
  const params = await searchParams;
  const created = params.created === "1";
  const updated = params.updated === "1";

  // Listings are scoped to the signed-in agent — never to "the first user".
  const rawListings = await prisma.listing.findMany({
    where: {
      agentId: session?.user.id,
    },
    include: {
      images: { orderBy: { order: "asc" } },
      _count: { select: { inquiries: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const listings: AgentListing[] = rawListings.map((listing) => {
    const attrs = listing.attributes as Record<string, unknown> | null;
    return {
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      type: listing.type as AgentListing["type"],
      status: listing.status as AgentListing["status"],
      price: formatPrice(listing.price, listing.currency),
      city: listing.city,
      state: listing.state,
      address: listing.address,
      submittedAt: formatRelativeTime(listing.createdAt),
      publishedAt:
        listing.status === "PUBLISHED"
          ? formatRelativeTime(listing.updatedAt)
          : undefined,
      bedrooms: attrs?.bedrooms as number | undefined,
      bathrooms: attrs?.bathrooms as number | undefined,
      size:
        (attrs?.size as string) ??
        `${(attrs?.sizeInPlots as number) ?? "N/A"} plots`,
      coverTone: coverToneByStatus[listing.status] ?? "gray",
      description: listing.description,
      amenities: (attrs?.amenities as string[]) ?? [],
      images: listing.images.map((img) => ({ url: img.url })),
      views: listing.viewCount,
      inquiries: listing._count.inquiries,
      createdAt: listing.createdAt.getTime(),
      priceValue: Number(listing.price),
      reviewNote: listing.rejectionReason,
    };
  });

  const pendingCount = rawListings.filter((l) => l.status === "DRAFT").length;
  const activeCount = rawListings.filter(
    (l) => l.status === "PUBLISHED",
  ).length;
  const totalViews = rawListings.reduce((sum, l) => sum + l.viewCount, 0);
  const totalInquiries = rawListings.reduce(
    (sum, l) => sum + l._count.inquiries,
    0,
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
              Agent
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              My Listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Manage your property listings — create, edit, and track their
              status.
            </p>
          </div>

          <Link
            href="/agent/listings/create"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-forest-700 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-forest-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Listing
          </Link>
        </header>

        {created ? (
          <p
            role="status"
            className="mt-6 rounded-card border border-success/30 bg-success/5 px-4 py-3 text-sm font-semibold text-forest-800"
          >
            Listing submitted for review. An admin will approve it before it
            appears on the public site.
          </p>
        ) : null}

        {updated ? (
          <p
            role="status"
            className="mt-6 rounded-card border border-success/30 bg-success/5 px-4 py-3 text-sm font-semibold text-forest-800"
          >
            Listing updated. Published listings reflect the change immediately.
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Building2}
            label="Total listings"
            value={String(listings.length)}
            detail="All time"
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Active listings"
            value={String(activeCount)}
            detail="Live on site"
          />
          <SummaryCard
            icon={Clock3}
            label="Pending approval"
            value={String(pendingCount)}
            detail="Awaiting review"
          />
          <SummaryCard
            icon={Eye}
            label="Views"
            value={String(totalViews)}
            detail={`${totalInquiries} enquir${totalInquiries === 1 ? "y" : "ies"} total`}
          />
        </section>

        <section className="mt-8">
          <ListingList listings={listings} />
        </section>
      </div>
    </div>
  );
}
