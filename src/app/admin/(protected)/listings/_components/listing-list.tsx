"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  Eye,
  Flag,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { AdminListing, ListingStatus, ListingType } from "./listing-data";

type ListingListProps = {
  listings: AdminListing[];
  mode: "all" | "pending";
};

const statusLabels: Record<ListingStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  UNDER_OFFER: "Under Offer",
  SOLD: "Sold",
  RENTED: "Rented",
  ARCHIVED: "Archived",
};

const statusStyles: Record<ListingStatus, string> = {
  DRAFT: "border-gray-200 bg-gray-50 text-gray-600",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-[#114b3d]",
  UNDER_OFFER: "border-amber-200 bg-amber-50 text-amber-700",
  SOLD: "border-blue-200 bg-blue-50 text-blue-700",
  RENTED: "border-purple-200 bg-purple-50 text-purple-700",
  ARCHIVED: "border-rose-200 bg-rose-50 text-rose-700",
};

const coverStyles = {
  green: "bg-emerald-50 text-[#114b3d]",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  gray: "bg-gray-100 text-gray-500",
};

export function ListingList({ listings, mode }: ListingListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ListingStatus | "all">("all");
  const [type, setType] = useState<ListingType | "all">("all");

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          listing.title,
          listing.city,
          listing.state,
          listing.agent,
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
  }, [listings, query, status, type]);

  return (
    <div>
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="flex h-12 items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-500 focus-within:border-[#114b3d]/35 focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, city, agent, or price"
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
              disabled={mode === "pending"}
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
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        {filteredListings.map((listing) => (
          <article
            key={listing.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-[#114b3d]/35 hover:bg-emerald-50/40 sm:p-5"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <Link
                href={`/admin/listings/${listing.id}`}
                className="flex min-w-0 flex-1 gap-4"
              >
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0].url}
                    alt={listing.title}
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
                    {mode === "all" ? (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[listing.status]}`}
                      >
                        {statusLabels[listing.status]}
                      </span>
                    ) : null}
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
                    by {listing.agent} / submitted {listing.submittedAt}
                  </p>
                </div>
              </Link>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href={`/admin/listings/${listing.id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View
                </Link>
                {listing.status === "DRAFT" ? (
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-white px-4 text-sm font-bold text-[#114b3d] transition-colors hover:bg-emerald-50"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Publish
                  </button>
                ) : null}
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50"
                >
                  <Flag className="h-4 w-4" aria-hidden="true" />
                  Flag
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
