import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Square,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { formatArea, formatDate, initials } from "@/lib/format";

type PageProps = { params: Promise<{ slug: string }> };

async function getListing(slug: string) {
  return prisma.listing.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      images: { orderBy: { order: "asc" } },
      agent: { select: { id: true, name: true, email: true, phone: true, image: true } },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) return { title: "Property not found" };

  return {
    title: listing.title,
    description: listing.description.slice(0, 155),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 155),
      images: listing.images[0] ? [{ url: listing.images[0].url }] : undefined,
      type: "website",
    },
  };
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) notFound();

  const attributes =
    listing.attributes && typeof listing.attributes === "object"
      ? (listing.attributes as Record<string, unknown>)
      : {};
  const cover = listing.images[0];
  const isLand = listing.type === "LAND";
  const intent = asText(attributes.transactionType);
  const negotiable = attributes.negotiable === true;

  const facts = isLand
    ? [
        {
          label: "Size",
          value: formatArea(
            asText(attributes.size) ?? asText(attributes.sizeInPlots),
            asText(attributes.sizeUnit) ??
              (attributes.sizeInPlots ? "plots" : null),
          ),
        },
        { label: "Title", value: asText(attributes.titleType) ?? "—" },
        {
          label: "Survey plan",
          value: attributes.surveyPlanAvailable === true ? "Available" : "—",
        },
      ]
    : [
        { label: "Bedrooms", value: asText(attributes.bedrooms) ?? "—" },
        { label: "Bathrooms", value: asText(attributes.bathrooms) ?? "—" },
        { label: "Toilets", value: asText(attributes.toilets) ?? "—" },
        { label: "Parking", value: asText(attributes.parking) ?? "—" },
        {
          label: "Size",
          value: formatArea(asText(attributes.size), asText(attributes.sizeUnit)),
        },
        { label: "Year built", value: asText(attributes.yearBuilt) ?? "—" },
      ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to results
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-ivory-100">
            {cover ? (
              <Image
                src={cover.url}
                alt={listing.title}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-full items-center justify-center bg-gradient-to-br from-forest-700/10 to-gold-500/10 text-sm font-semibold text-muted-500"
              >
                No photo yet
              </div>
            )}
          </div>

          {listing.images.length > 1 ? (
            <ul className="mt-2 grid grid-cols-4 gap-2" aria-label="More photos">
              {listing.images.slice(1, 5).map((image) => (
                <li
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-control bg-ivory-100"
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="15vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          ) : null}

          <section className="mt-8">
            <h2 className="text-h3 font-bold text-ink-900">About this property</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">
              {listing.description}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-h3 font-bold text-ink-900">
              {isLand ? "Land details" : "Property details"}
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-card border border-ink-900/10 bg-white p-4"
                >
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-ink-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-8">
            <h2 className="text-h3 font-bold text-ink-900">Location</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-700">
              <MapPin className="h-4 w-4 text-muted-500" aria-hidden />
              {listing.address}, {listing.city}, {listing.state}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${listing.address}, ${listing.city}, ${listing.state}, ${listing.country}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-forest-700 underline-offset-4 hover:underline"
            >
              Open in Google Maps
            </a>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-ink-900/10 bg-white p-6 shadow-card">
            <p className="text-2xl font-bold text-forest-700">
              <Price value={listing.price} currency={listing.currency} />
            </p>
            <h1 className="mt-2 text-h3 font-bold leading-snug text-ink-900">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="info">{isLand ? "Land" : "House"}</Badge>
              {intent ? (
                <Badge tone="neutral">
                  {intent === "rent" ? "For rent" : "For sale"}
                </Badge>
              ) : null}
              {negotiable ? <Badge tone="success">Negotiable</Badge> : null}
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-muted-500">
              <MapPin className="h-4 w-4" aria-hidden />
              {listing.city}, {listing.state}
            </p>

            <ul className="mt-5 flex flex-wrap gap-4 border-t border-ink-900/5 pt-5 text-sm text-ink-700">
              {isLand ? (
                <li className="flex items-center gap-1.5">
                  <Square className="h-4 w-4 text-muted-500" aria-hidden />
                  {formatArea(asText(attributes.size), asText(attributes.sizeUnit))}
                </li>
              ) : (
                <>
                  <li className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-muted-500" aria-hidden />
                    {asText(attributes.bedrooms) ?? "—"} beds
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-muted-500" aria-hidden />
                    {asText(attributes.bathrooms) ?? "—"} baths
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4 text-muted-500" aria-hidden />
                    {formatArea(asText(attributes.size), asText(attributes.sizeUnit))}
                  </li>
                </>
              )}
            </ul>

            <div className="mt-6 rounded-card border border-ink-900/10 bg-surface p-4">
              <div className="flex items-center gap-3">
                {listing.agent.image ? (
                  <Image
                    src={listing.agent.image}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-700/10 text-sm font-bold text-forest-700"
                  >
                    {initials(listing.agent.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {listing.agent.name}
                  </p>
                  <p className="text-xs text-muted-500">Listing agent</p>
                </div>
              </div>

              <dl className="mt-4 space-y-2 text-sm text-ink-700">
                {listing.agent.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-500" aria-hidden />
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${listing.agent.phone}`}
                        className="hover:underline"
                      >
                        {listing.agent.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-500" aria-hidden />
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${listing.agent.email}?subject=${encodeURIComponent(
                        `Enquiry about ${listing.title}`,
                      )}`}
                      className="hover:underline"
                    >
                      Email the agent
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="mt-4 flex items-start gap-2 rounded-control bg-white px-3 py-2 text-xs text-muted-500">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                In-app enquiries arrive in Phase 3; for now this listing is
                contactable by phone or email.
              </p>
            </div>

            <p className="mt-4 text-xs text-muted-500">
              Listed {formatDate(listing.createdAt)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
