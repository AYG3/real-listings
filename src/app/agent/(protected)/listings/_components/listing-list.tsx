"use client";

import Image from "next/image";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  Home,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { StatusPill } from "@/components/ui/badge";
import { ListingActions } from "./listing-actions";
import type { AgentListing, ListingStatus, ListingType } from "./listing-data";

type ListingListProps = {
  listings: AgentListing[];
};

const coverStyles = {
  green: "bg-emerald-50 text-forest-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  gray: "bg-gray-100 text-gray-500",
};

export function ListingList({ listings }: ListingListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ListingStatus | "all">("all");
  const [type, setType] = useState<ListingType | "all">("all");
  const [sort, setSort] = useState<"newest" | "price" | "views">("newest");

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = listings.filter((listing) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          listing.title,
          listing.city,
          listing.state,
          listing.price,
          listing.type,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus = status === "all" || listing.status === status;
      const matchesType = type === "all" || listing.type === type;

      return matchesQuery && matchesStatus && matchesType;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "views") return b.views - a.views;
      if (sort === "price") return b.priceValue - a.priceValue;
      return b.createdAt - a.createdAt;
    });
  }, [listings, query, status, type, sort]);

  return (
    <div>
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_140px_160px]">
          <label className="flex h-12 items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500 focus-within:border-forest-700/35 focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, city, or price"
              className="min-w-0 flex-1 bg-transparent text-gray-950 outline-none placeholder:text-gray-400"
            />
          </label>

          <label className="flex h-12 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-600">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ListingStatus | "all")
              }
              className="min-w-0 flex-1 bg-transparent outline-none"
            >
              <option value="all">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="UNDER_OFFER">Under Offer</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>

          <label className="flex h-12 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-600">
            <Home className="h-4 w-4" aria-hidden="true" />
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as ListingType | "all")
              }
              className="min-w-0 flex-1 bg-transparent outline-none"
            >
              <option value="all">All types</option>
              <option value="HOUSE">House</option>
              <option value="LAND">Land</option>
            </select>
          </label>

          <label className="flex h-12 items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-600">
            <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as "newest" | "price" | "views")
              }
              className="min-w-0 flex-1 bg-transparent outline-none"
              aria-label="Sort listings"
            >
              <option value="newest">Newest first</option>
              <option value="price">Highest price</option>
              <option value="views">Most viewed</option>
            </select>
          </label>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-gray-950">
            {listings.length === 0
              ? "No listings yet"
              : "No listings match those filters"}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            {listings.length === 0
              ? "Create your first listing and it will appear here while an admin reviews it."
              : "Try clearing the search or choosing a different status."}
          </p>
          {listings.length === 0 ? (
            <Link
              href="/agent/listings/create"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-forest-700 px-4 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create your first listing
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4">
        {filteredListings.map((listing) => (
          <article
            key={listing.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-forest-700/35 hover:bg-emerald-50/40 sm:p-5"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-1 gap-4">
                {listing.images?.[0] ? (
                  <Image
                    src={listing.images[0].url}
                    alt={listing.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-lg ${coverStyles[listing.coverTone]}`}
                  >
                    <Home className="h-8 w-8" aria-hidden="true" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-950">
                      {listing.title}
                    </h2>
                    <span
                      className="rounded-full"
                    >
                      <StatusPill status={listing.status} />
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {listing.city}, {listing.state}
                    </span>
                    <span>{listing.type}</span>
                    <span>{listing.price}</span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-gray-500">
                    Submitted {listing.submittedAt} <span className="text-gray-300">/</span>{" "}
                    {listing.views} view{listing.views === 1 ? "" : "s"}{" "}
                    <span className="text-gray-300">/</span> {listing.inquiries}{" "}
                    enquir{listing.inquiries === 1 ? "y" : "ies"}
                  </p>
                </div>
              </div>

              <ListingActions
                listingId={listing.id}
                status={listing.status}
                slug={listing.slug ?? listing.id}
                isPublic={listing.status === "PUBLISHED"}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
