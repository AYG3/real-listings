import { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Square,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ListingCard } from "@/components/listing/listing-card";
import { getSession } from "@/lib/auth/guards";
import { brand } from "@/lib/brand";
import {
  formatArea,
  formatDate,
  formatPrice,
  initials,
  toNumber,
} from "@/lib/format";
import { getSimilarListings } from "@/lib/listing/queries";
import { cachedByKey } from "@/lib/listing/public-cache";
import { serializeJsonLd } from "@/lib/listing/json-ld";
import { EnquiryForm } from "./_components/enquiry-form";
import { ListingGallery } from "./_components/listing-gallery";
import { SaveButton } from "./_components/save-button";

type PageProps = { params: Promise<{ slug: string }> };

// Two costs stack up here: a relation `include` is three sequential round trips
// on Prisma's engine, and each trip to the database is ~250ms away — so the
// relations are fetched in parallel (one round trip), and the result is kept for
// a short TTL because a published listing is public, read-mostly data. Every
// listing mutation clears the cache, so read-your-own-writes still holds.
async function fetchListing(slug: string) {
  const where = { slug, status: "PUBLISHED" as const };
  const [listing, images, agent] = await Promise.all([
    prisma.listing.findFirst({ where }),
    prisma.listingImage.findMany({
      where: { listing: where },
      orderBy: { order: "asc" },
    }),
    prisma.user.findFirst({
      where: { listings: { some: where } },
      select: {
        id: true,
        name: true,
        phone: true,
        image: true,
        agencyName: true,
        bio: true,
        agentStatus: true,
      },
    }),
  ]);

  if (!listing || !agent) return null;

  return { ...listing, images, agent };
}

/** Per-request dedupe on top of the TTL cache (metadata + page share it). */
const getListing = cache((slug: string) =>
  cachedByKey(`listing:${slug}`, () => fetchListing(slug)),
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) return { title: "Property not found" };

  const price = formatPrice(listing.price, listing.currency);
  const description = `${price} · ${listing.city}, ${listing.state}. ${listing.description.slice(0, 120)}`;

  return {
    title: listing.title,
    description,
    openGraph: {
      title: `${listing.title} — ${price}`,
      description,
      images: listing.images[0]
        ? [{ url: listing.images[0].url, alt: listing.title }]
        : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.title} — ${price}`,
      description,
      images: listing.images[0] ? [listing.images[0].url] : undefined,
    },
  };
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

type SimilarListingSource = {
  id: string;
  city: string;
  state: string;
  type: "HOUSE" | "LAND";
};

async function SimilarListings({ listing }: { listing: SimilarListingSource }) {
  const similarListings = await getSimilarListings(listing);

  if (similarListings.length === 0) return null;

  return (
    <section className="mt-10 border-t border-ink-900/10 pt-8">
      <h2 className="text-h3 font-bold text-ink-900">
        Similar properties in {listing.city}
      </h2>
      <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
        {similarListings.map((similar) => (
          <li key={similar.id}>
            <ListingCard listing={similar} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SimilarListingsSkeleton({ city }: { city: string }) {
  return (
    <section
      className="mt-10 border-t border-ink-900/10 pt-8"
      aria-busy="true"
      aria-live="polite"
    >
      <h2 className="text-h3 font-bold text-ink-900">
        Similar properties in {city}
      </h2>
      <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
        {[0, 1, 2].map((slot) => (
          <li key={slot} aria-hidden="true">
            <div className="h-full animate-pulse overflow-hidden rounded-card border border-ink-900/10 bg-white shadow-card">
              <div className="aspect-[4/3] bg-ink-900/5" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-24 rounded bg-ink-900/5" />
                <div className="h-5 w-3/4 rounded bg-ink-900/5" />
                <div className="h-4 w-1/2 rounded bg-ink-900/5" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params;
  // Session and listing are independent; fetch them together so the public
  // page pays one database round trip instead of two.
  const [listing, session] = await Promise.all([getListing(slug), getSession()]);

  if (!listing) notFound();

  // Only the saved flag is needed to paint above the fold. Similar listings
  // stream in behind Suspense so the hero is not held back by a third query.
  const savedByViewer = session?.user
    ? await prisma.savedListing
        .findUnique({
          where: {
            userId_listingId: {
              userId: session.user.id,
              listingId: listing.id,
            },
          },
          select: { id: true },
        })
        .then(Boolean)
    : false;

  const referrer = (await headers()).get("referer");

  // Analytics must never delay or break the page.
  after(async () => {
    try {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { viewCount: { increment: 1 } },
      });
      await prisma.listingView.create({
        data: { listingId: listing.id, referrer },
      });
    } catch {
      // Ignored on purpose.
    }
  });

  const attributes =
    listing.attributes && typeof listing.attributes === "object"
      ? (listing.attributes as Record<string, unknown>)
      : {};
  const isLand = listing.type === "LAND";
  const intent = listing.intent === "RENT" ? "rent" : "sale";
  const negotiable = attributes.negotiable === true;
  const amenities = Array.isArray(attributes.amenities)
    ? attributes.amenities.filter(
        (item): item is string => typeof item === "string" && !!item,
      )
    : [];
  const listedAt = listing.publishedAt ?? listing.createdAt;
  const agentVerified = listing.agent.agentStatus === "VERIFIED";

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

  const listingUrl = `${brand.url.replace(/\/$/, "")}/properties/${listing.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description.slice(0, 300),
    url: listingUrl,
    image: listing.images.map((image) => image.url),
    datePosted: listedAt.toISOString(),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      addressCountry: "NG",
    },
    offers: {
      "@type": "Offer",
      price: toNumber(listing.price),
      priceCurrency: listing.currency,
      availability: "https://schema.org/InStock",
      url: listingUrl,
    },
  };

  // A hostile title or description containing "</script>" must not break out
  // of the JSON-LD block; the helper escapes `<` and line separators.
  const jsonLdHtml = serializeJsonLd(jsonLd);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-muted-500">
          <li>
            <Link href="/" className="hover:text-forest-700">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/properties" className="hover:text-forest-700">
              Properties
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="truncate font-semibold text-ink-900">{listing.title}</li>
        </ol>
      </nav>

      <Link
        href="/properties"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to results
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <ListingGallery
            photos={listing.images.map((image) => ({
              id: image.id,
              url: image.url,
            }))}
            title={listing.title}
          />

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

          {amenities.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-h3 font-bold text-ink-900">Amenities</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-sm text-ink-700"
                  >
                    <Check className="h-3.5 w-3.5 text-success" aria-hidden />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

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

          <Suspense fallback={<SimilarListingsSkeleton city={listing.city} />}>
            <SimilarListings
              listing={{
                id: listing.id,
                city: listing.city,
                state: listing.state,
                type: listing.type,
              }}
            />
          </Suspense>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-ink-900/10 bg-white p-6 shadow-card">
            <p className="text-2xl font-bold text-forest-700">
              <Price value={listing.price} currency={listing.currency} />
            </p>
            <h1 className="mt-2 text-h3 font-bold leading-snug text-ink-900">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="info">{isLand ? "Land" : "House"}</Badge>
              <Badge tone="neutral">
                {intent === "rent" ? "For rent" : "For sale"}
              </Badge>
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

            <div className="mt-6">
              <SaveButton
                listingId={listing.id}
                initialSaved={savedByViewer}
                isAuthenticated={Boolean(session?.user)}
              />
            </div>

            <div className="mt-6 rounded-card border border-ink-900/10 bg-surface p-4">
              <div className="flex items-center gap-3">
                {listing.agent.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar hosts are not guaranteed in remotePatterns
                  <img
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
                  <p className="text-xs text-muted-500">
                    {listing.agent.agencyName ?? "Listing agent"}
                  </p>
                </div>
              </div>

              {agentVerified ? (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-forest-800">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  Verified agent
                </p>
              ) : null}

              {listing.agent.bio ? (
                <p className="mt-3 text-sm text-ink-700">{listing.agent.bio}</p>
              ) : null}

              <dl className="mt-4 space-y-2 text-sm text-ink-700">
                {listing.agent.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-500" aria-hidden />
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${listing.agent.phone.replace(/[^+\d]/g, "")}`}
                        className="hover:underline"
                      >
                        {listing.agent.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <p className="mt-4 text-xs text-muted-500">
                Enquiries come through the form below — email addresses are
                never published on this page.
              </p>
            </div>

            <div className="mt-5 rounded-card border border-ink-900/10 bg-white p-4">
              <h2 className="text-base font-bold text-ink-900">
                Enquire about this property
              </h2>
              <p className="mb-4 mt-1 text-xs text-muted-500">
                Send {listing.agent.name} a message. You do not need an account.
              </p>
              <EnquiryForm
                listingId={listing.id}
                agentName={listing.agent.name}
                title={listing.title}
              />
            </div>

            <p className="mt-4 text-xs text-muted-500">
              Listed {formatDate(listedAt)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
