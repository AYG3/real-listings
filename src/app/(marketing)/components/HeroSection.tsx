import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
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
      {/* A CSS gradient instead of a background photo: it paints with the
          stylesheet, so it never becomes a late LCP candidate on slow links. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,var(--color-forest-600)_0%,var(--color-forest-800)_55%,var(--color-forest-900)_100%)]"
      />

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
          <p className="mt-5">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
            >
              New here? Take the two-minute demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </div>

        {/* Plain GET form: works without JavaScript, and every result is a shareable URL. */}
        <form
          action="/properties"
          method="get"
          className="mt-10 rounded-card border border-white/15 bg-ivory-50 p-4 shadow-lift sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <TextField
              id="hero-q"
              name="q"
              type="search"
              label="Location or keyword"
              placeholder="Lekki, Abuja, Gwarinpa…"
              wrapperClassName="sm:col-span-2"
            />

            <SelectField id="hero-intent" name="intent" label="Purpose">
              <option value="">Buy or rent</option>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </SelectField>

            <SelectField id="hero-type" name="type" label="Property type">
              <option value="">Any type</option>
              <option value="house">House</option>
              <option value="land">Land</option>
            </SelectField>

            <SelectField
              id="hero-max-price"
              name="maxPrice"
              label="Budget"
              wrapperClassName="sm:col-span-2 lg:col-span-1"
            >
              {BUDGET_STEPS.map((step) => (
                <option key={step.label} value={step.value}>
                  {step.label}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-ink-900/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Every listing is reviewed before it goes live.
              </p>
              <Suspense
                fallback={
                  <p className="text-xs font-medium text-muted-500">
                    Loading live inventory…
                  </p>
                }
              >
                <HeroStats />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/properties"
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Browse all
              </Link>
              <button type="submit" className={buttonStyles({ size: "md" })}>
                <Search className="h-4 w-4" aria-hidden="true" />
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
