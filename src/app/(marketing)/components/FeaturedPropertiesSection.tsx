import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getFeaturedListings } from "@/lib/listing/queries";

export default async function FeaturedPropertiesSection() {
  const listings = await getFeaturedListings(6);

  return (
    <section className="bg-ivory-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-h2 font-bold text-ink-900">Latest properties</h2>
            <p className="mt-2 text-sm text-muted-500">
              The newest listings published by verified agents.
            </p>
          </div>

          <Link
            href="/properties"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            View all properties
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={Building2}
              title="No published listings yet"
              description="Listings appear here as soon as an admin approves an agent submission."
              action={
                <Link
                  href="/agent/auth/register"
                  className={buttonStyles({ variant: "secondary" })}
                >
                  Become an agent
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
