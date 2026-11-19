import Link from "next/link";
import { notFound } from "next/navigation";
import BasicInformation from "@/app/admin/(protected)/upload/_components/basic-information";
import Location from "@/app/admin/(protected)/upload/_components/location";
import ListingDetails from "@/app/admin/(protected)/upload/_components/listing-details";
import { StatusPill } from "@/components/ui/badge";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { toNumber } from "@/lib/format";
import CloudinaryUploadWidget from "@/components/upload/CldUploadWidget";
import { ImageManager } from "../../_components/image-manager";
import { EditListingForm } from "./_components/edit-listing-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireAgent();

  const listing = await prisma.listing.findFirst({
    where: { id, agentId: session.user.id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!listing) notFound();

  const attributes = (listing.attributes ?? {}) as Record<string, unknown>;
  const asString = (value: unknown) =>
    typeof value === "string" ? value : value === undefined || value === null ? undefined : String(value);
  const asNumber = (value: unknown) =>
    typeof value === "number" ? value : undefined;

  const transactionType =
    asString(attributes.transactionType) ??
    (listing.intent === "RENT" ? "rent" : "sale");

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
              Agent
            </p>
            <h1 className="mt-2 flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight text-gray-950">
              Edit listing
              <StatusPill status={listing.status} />
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              {listing.title}
            </p>
          </div>

          <Link
            href="/agent/listings"
            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to listings
          </Link>
        </header>

        <EditListingForm listingId={listing.id}>
          <>
              <BasicInformation
                showStatus={false}
                defaults={{
                  title: listing.title,
                  price: String(toNumber(listing.price)),
                  type: listing.type,
                  transactionType,
                  negotiable: attributes.negotiable === true,
                  description: listing.description,
                }}
              />
              <Location
                defaults={{
                  state: listing.state,
                  city: listing.city,
                  area: asString(attributes.area),
                  landmark: asString(attributes.landmark),
                  address: listing.address,
                }}
              />
              <ListingDetails
                defaults={{
                  bedrooms: asNumber(attributes.bedrooms),
                  bathrooms: asNumber(attributes.bathrooms),
                  toilets: asNumber(attributes.toilets),
                  parking: asNumber(attributes.parking),
                  size: asString(attributes.size),
                  sizeUnit: asString(attributes.sizeUnit),
                  yearBuilt: asString(attributes.yearBuilt),
                }}
                media={
                  <div className="space-y-3">
                    <ImageManager
                      images={listing.images.map((image) => ({
                        id: image.id,
                        url: image.url,
                        isCover: image.isCover,
                      }))}
                    />
                    <div className="rounded-control border border-ink-900/10 bg-white p-3">
                      <p className="mb-2 text-xs font-semibold text-ink-900">
                        Add more photos
                        <span className="ml-1 font-normal text-muted-500">
                          (appended after the photos above)
                        </span>
                      </p>
                      <CloudinaryUploadWidget />
                    </div>
                  </div>
                }
              />
          </>
        </EditListingForm>
      </div>
    </div>
  );
}
