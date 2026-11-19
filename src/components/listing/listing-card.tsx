import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { formatArea } from "@/lib/format";
import type { ListingCardData } from "@/lib/listing/queries";

type Attributes = Record<string, unknown>;

function readAttributes(value: unknown): Attributes {
  return value && typeof value === "object" ? (value as Attributes) : {};
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

export function ListingCard({
  listing,
  eager = false,
}: {
  listing: ListingCardData;
  eager?: boolean;
}) {
  const attributes = readAttributes(listing.attributes);
  const cover = listing.images[0];
  const isLand = listing.type === "LAND";

  const intent =
    listing.intent === "RENT" ? "rent" : asText(attributes.transactionType);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-white shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-100">
        {cover ? (
          <Image
            src={cover.url}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            // Cards are small on the page; 62 halves the bytes of a six-card
            // grid with no visible difference at these sizes.
            quality={62}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "low"}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full items-center justify-center bg-gradient-to-br from-forest-700/10 to-gold-500/10 text-sm font-semibold text-muted-500"
          >
            No photo yet
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="info" className="bg-white/95 backdrop-blur">
            {isLand ? "Land" : "House"}
          </Badge>
          {intent ? (
            <Badge tone="neutral" className="bg-white/95 backdrop-blur">
              {intent === "rent" ? "For rent" : "For sale"}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xl font-bold text-forest-700">
          <Price value={listing.price} currency={listing.currency} />
        </p>

        <h3 className="mt-1 text-base font-semibold leading-snug text-ink-900">
          {/* Stretched link keeps the whole card clickable without nesting anchors. */}
          <Link
            href={`/properties/${listing.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {listing.title}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-500">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {listing.city}, {listing.state}
        </p>

        <dl className="mt-4 flex items-center gap-4 border-t border-ink-900/5 pt-4 text-sm text-ink-700">
          {isLand ? (
            <div className="flex items-center gap-1.5">
              <Square className="h-4 w-4 text-muted-500" aria-hidden />
              <dt className="sr-only">Size</dt>
              <dd>
                {formatArea(
                  asText(attributes.size) ?? asText(attributes.sizeInPlots),
                  asText(attributes.sizeUnit) ??
                    (attributes.sizeInPlots ? "plots" : null),
                )}
              </dd>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-muted-500" aria-hidden />
                <dt className="sr-only">Bedrooms</dt>
                <dd>{asText(attributes.bedrooms) ?? "—"} beds</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-muted-500" aria-hidden />
                <dt className="sr-only">Bathrooms</dt>
                <dd>{asText(attributes.bathrooms) ?? "—"} baths</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-muted-500" aria-hidden />
                <dt className="sr-only">Size</dt>
                <dd>
                  {formatArea(
                    asText(attributes.size),
                    asText(attributes.sizeUnit),
                  )}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </article>
  );
}
