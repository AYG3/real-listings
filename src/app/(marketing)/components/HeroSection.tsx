import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { getPublicStats } from "@/lib/listing/queries";

const BUDGET_STEPS = [
  { value: "", label: "Any price" },
  { value: "25000000", label: "Up to ₦25m" },
  { value: "50000000", label: "Up to ₦50m" },
  { value: "75000000", label: "Up to ₦75m" },
  { value: "100000000", label: "Up to ₦100m" },
  { value: "200000000", label: "Up to ₦200m" },
  { value: "500000000", label: "Up to ₦500m" },
];

const fieldClass =
  "h-11 w-full rounded-control border border-ink-900/15 bg-white px-3 text-sm text-ink-900 placeholder:text-muted-500/70 focus:border-forest-700 focus:outline-none";
const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-500";

/**
 * The stats line is the only part of the hero that needs the database, so it
 * streams in on its own. Awaiting it here would hold back the `<h1>` — the
 * largest element on the page — behind a cross-region query.
 */
async function HeroStats() {
  const stats = await getPublicStats();

  return (
    <p className="text-xs font-medium text-muted-500">
      {stats.listings.toLocaleString("en-NG")} published{" "}
      {stats.listings === 1 ? "listing" : "listings"} ·{" "}
      {stats.agents.toLocaleString("en-NG")}{" "}
      {stats.agents === 1 ? "agent" : "agents"} ·{" "}
      {stats.cities.toLocaleString("en-NG")}{" "}
      {stats.cities === 1 ? "city" : "cities"}
    </p>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900">
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/images/auth-bg.svg')] bg-cover bg-center opacity-70"
      />
      <div aria-hidden className="absolute inset-0 bg-forest-900/75" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-caption font-bold uppercase tracking-[0.18em] text-gold-500">
            Verified listings across Nigeria
          </p>
          <h1 className="mt-4 text-h1 font-bold text-white md:text-display">
            Find a property you can actually trust.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/75">
            Every listing is submitted by an agent and reviewed before it goes
            live. Search by location, price, and property type.
          </p>
        </div>

        {/* Plain GET form: works without JavaScript, and every result is a shareable URL. */}
        <form
          action="/properties"
          method="get"
          className="mt-10 rounded-card border border-white/15 bg-ivory-50 p-4 shadow-lift sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2">
              <label htmlFor="hero-q" className={labelClass}>
                Location or keyword
              </label>
              <input
                id="hero-q"
                name="q"
                type="search"
                placeholder="Lekki, Abuja, Gwarinpa…"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="hero-intent" className={labelClass}>
                Purpose
              </label>
              <select id="hero-intent" name="intent" className={fieldClass}>
                <option value="">Buy or rent</option>
                <option value="sale">For sale</option>
                <option value="rent">For rent</option>
              </select>
            </div>

            <div>
              <label htmlFor="hero-type" className={labelClass}>
                Property type
              </label>
              <select id="hero-type" name="type" className={fieldClass}>
                <option value="">Any type</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label htmlFor="hero-max-price" className={labelClass}>
                Budget
              </label>
              <select id="hero-max-price" name="maxPrice" className={fieldClass}>
                {BUDGET_STEPS.map((step) => (
                  <option key={step.label} value={step.value}>
                    {step.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Suspense
              fallback={
                <p className="text-xs font-medium text-muted-500">
                  Loading live inventory…
                </p>
              }
            >
              <HeroStats />
            </Suspense>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/demo"
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Take the demo
              </Link>
              <Link
                href="/properties"
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Browse all
              </Link>
              <button type="submit" className={buttonStyles({ size: "md" })}>
                <Search className="h-4 w-4" aria-hidden />
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
