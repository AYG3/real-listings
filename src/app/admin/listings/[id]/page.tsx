import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Check,
  Flag,
  Home,
  MapPin,
  Ruler,
  UserRound,
} from "lucide-react";
import prisma from "@/lib/prisma";
import type { ListingStatus } from "@/prisma/generated/enums";
import ImageGallery from "./image-gallery";

type ListingDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const statusStyles: Record<ListingStatus, string> = {
  DRAFT: "border-gray-200 bg-gray-50 text-gray-600",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-[#114b3d]",
  UNDER_OFFER: "border-amber-200 bg-amber-50 text-amber-700",
  SOLD: "border-blue-200 bg-blue-50 text-blue-700",
  RENTED: "border-purple-200 bg-purple-50 text-purple-700",
  ARCHIVED: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusLabels: Record<ListingStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  UNDER_OFFER: "Under Offer",
  SOLD: "Sold",
  RENTED: "Rented",
  ARCHIVED: "Archived",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ListingDetailsPage({
  params,
}: ListingDetailsPageProps) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      agent: { select: { name: true } },
    },
  });

  if (!listing) {
    notFound();
  }

  const attributes = listing.attributes as Record<string, unknown> | null;

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/admin/listings"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#114b3d] hover:text-[#0d3b2f]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to listings
        </Link>

        <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ImageGallery
            images={listing.images}   
            title={listing.title}
          />

            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[listing.status]}`}
                >
                  {statusLabels[listing.status]}
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                  {listing.type}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                {listing.title}
              </h1>

              <p className="mt-3 text-2xl font-bold text-[#114b3d]">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: listing.currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(listing.price.toNumber())}
              </p>

              <div className="mt-5 grid gap-3 text-sm font-semibold text-gray-600">
                <InfoLine
                  icon={MapPin}
                  text={`${listing.address}, ${listing.city}, ${listing.state}`}
                />
                <InfoLine
                  icon={UserRound}
                  text={`Submitted by ${listing.agent.name}`}
                />
                <InfoLine
                  icon={Building2}
                  text={`Submitted ${formatDate(listing.createdAt)}${
                    listing.status === "PUBLISHED"
                      ? ` / published ${formatDate(listing.updatedAt)}`
                      : ""
                  }`}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Spec
                  icon={BedDouble}
                  label="Bedrooms"
                  value={(attributes?.bedrooms as number | string) ?? "-"}
                />
                <Spec
                  icon={Bath}
                  label="Bathrooms"
                  value={(attributes?.bathrooms as number | string) ?? "-"}
                />
                <Spec
                  icon={Ruler}
                  label="Size"
                  value={(attributes?.size as string) ?? "-"}
                />
                <Spec icon={Home} label="Type" value={listing.type} />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {listing.status === "DRAFT" ? (
                  <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-[#114b3d] px-5 text-sm font-bold text-white transition-colors hover:bg-[#0d3b2f]">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Publish listing
                  </button>
                ) : null}
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-5 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50">
                  <Flag className="h-4 w-4" aria-hidden="true" />
                  Flag listing
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-gray-950">Description</h2>
            <p className="mt-3 leading-7 text-gray-600">
              {listing.description}
            </p>
          </article>

          <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-gray-950">Amenities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {((attributes?.amenities as string[]) ?? []).map(
                (amenity: string) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-[#114b3d]"
                  >
                    {amenity}
                  </span>
                ),
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function InfoLine({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <p className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-[#114b3d]" aria-hidden="true" />
      {text}
    </p>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <Icon className="h-5 w-5 text-[#114b3d]" aria-hidden="true" />
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-950">{value}</p>
    </div>
  );
}
