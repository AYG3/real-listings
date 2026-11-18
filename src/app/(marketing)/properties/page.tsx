import type { Metadata } from "next";
import Link from "next/link";
import { Building2, SearchX } from "lucide-react";
import { FilterBar } from "@/components/listing/filter-bar";
import { ListingCard } from "@/components/listing/listing-card";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  hasActiveFilters,
  parseFilters,
  toQueryString,
  type SearchFilters,
} from "@/lib/listing/filters";
import { searchListings } from "@/lib/listing/queries";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const scope = filters.city ?? filters.state;
  const noun =
    filters.type === "LAND" ? "land" : filters.type ? "houses" : "property";
  const intent =
    filters.intent === "RENT"
      ? "for rent"
      : filters.intent === "SALE"
        ? "for sale"
        : "";

  const title = `${noun} ${intent}${scope ? ` in ${scope}` : ""}`
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description:
      "Browse verified property listings across Nigeria. Filter by price, location, and property type.",
  };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams);
  const result = await searchListings(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-h2 font-bold text-ink-900 md:text-h1">
          {filters.intent === "RENT"
            ? "Properties for rent"
            : filters.intent === "SALE"
              ? "Properties for sale"
              : "Browse properties"}
        </h1>
        <p className="mt-2 text-sm text-muted-500">
          {result.total.toLocaleString("en-NG")}{" "}
          {result.total === 1 ? "property" : "properties"} found
          {filters.q ? ` for “${filters.q}”` : ""}
          {filters.city
            ? ` in ${filters.city}`
            : filters.state
              ? ` in ${filters.state}`
              : ""}
          .
        </p>
      </header>

      <FilterBar filters={filters} />

      {result.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={SearchX}
            title="No properties match these filters"
            description="Try widening the price range, clearing the location, or browsing everything that is currently published."
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/properties" className={buttonStyles()}>
                  Clear all filters
                </Link>
                {filters.beds ? (
                  <Link
                    href={`/properties${toQueryString(filters, { beds: null, page: 1 })}`}
                    className={buttonStyles({ variant: "secondary" })}
                  >
                    Remove the bed filter
                  </Link>
                ) : null}
                {filters.minPrice || filters.maxPrice ? (
                  <Link
                    href={`/properties${toQueryString(
                      filters,
                      { minPrice: null, maxPrice: null, page: 1 },
                    )}`}
                    className={buttonStyles({ variant: "secondary" })}
                  >
                    Any price
                  </Link>
                ) : null}
              </div>
            }
          />
        </div>
      ) : (
        <>
          <ul
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))]"
            aria-label="Search results"
          >
            {result.items.map((listing, index) => (
              <li key={listing.id}>
                <ListingCard listing={listing} eager={index === 0} />
              </li>
            ))}
          </ul>

          <Pagination filters={filters} pageCount={result.pageCount} />
        </>
      )}

      {!hasActiveFilters(filters) && result.total === 0 ? (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-500">
          <Building2 className="h-4 w-4" aria-hidden />
          Nothing is published yet. Agents can add listings from their portal.
        </p>
      ) : null}
    </div>
  );
}

function Pagination({
  filters,
  pageCount,
}: {
  filters: SearchFilters;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const previous = filters.page > 1 ? filters.page - 1 : null;
  const next = filters.page < pageCount ? filters.page + 1 : null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-between gap-4 border-t border-ink-900/10 pt-6"
    >
      {previous ? (
        <Link
          href={`/properties${toQueryString(filters, { page: previous })}`}
          rel="prev"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          Previous
        </Link>
      ) : (
        <span />
      )}

      <p className="text-sm font-medium text-muted-500">
        Page {filters.page} of {pageCount}
      </p>

      {next ? (
        <Link
          href={`/properties${toQueryString(filters, { page: next })}`}
          rel="next"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
