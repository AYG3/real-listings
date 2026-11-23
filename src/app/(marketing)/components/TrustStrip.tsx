import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import { getPublicStats } from "@/lib/listing/queries";

/** The product's differentiator, stated once and backed by real counts. */
export default async function TrustStrip() {
  const stats = await getPublicStats();

  const items = [
    {
      icon: ShieldCheck,
      title: "Verified agents",
      body: "Every agent account is reviewed before it can publish a listing.",
    },
    {
      icon: BadgeCheck,
      title: "Reviewed before publishing",
      body: "An admin approves each listing, and the decision stays on record.",
    },
    {
      icon: MapPin,
      title: `${stats.listings.toLocaleString("en-NG")} live ${
        stats.listings === 1 ? "listing" : "listings"
      }`,
      body: `Across ${stats.cities} ${
        stats.cities === 1 ? "city" : "cities"
      } and ${stats.agents} ${stats.agents === 1 ? "agent" : "agents"}.`,
    },
  ];

  return (
    <section aria-label="How listings are verified" className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-12">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-forest-700/10 text-forest-700">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-500">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
