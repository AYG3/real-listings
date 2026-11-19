import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Building2, Lock, ShieldCheck, UserRound } from "lucide-react";
import { demoIdentities } from "@/lib/demo/accounts";
import { DemoEntry } from "./_components/demo-entry";

export const metadata: Metadata = {
  title: "Demo — Alara Estate",
  description:
    "Walk the buyer, agent and admin sides of Alara Estate without creating an account. Read-only, seeded, and reset nightly.",
};

const icons = {
  visitor: UserRound,
  agent: Building2,
  admin: ShieldCheck,
} as const;

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
          Portfolio demo
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
          Three sides of the marketplace, one click each
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-500">
          Every account below is seeded with real data and signed in through the
          same auth path a normal user takes. The accounts are read-only: you can
          open every screen, and anything that would change data explains why it
          is disabled instead of failing.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-forest-800">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Read-only demo · data resets nightly
        </p>
      </header>

      <ul className="mt-10 grid gap-6 lg:grid-cols-3">
        {demoIdentities.map((identity) => {
          const Icon = icons[identity.role];
          return (
            <li
              key={identity.role}
              className="flex flex-col rounded-card border border-ink-900/10 bg-white p-6 shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-forest-700 text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-2xl font-bold text-ink-900">
                {identity.headline}
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-500">
                {identity.blurb}
              </p>

              <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-700">
                {identity.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <BadgeCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-forest-700"
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>

              <DemoEntry
                email={identity.email}
                password={identity.password}
                next={identity.next}
                label={identity.label}
              />
            </li>
          );
        })}
      </ul>

      <section className="mt-12 rounded-card border border-ink-900/10 bg-surface p-6">
        <h2 className="text-xl font-bold text-ink-900">What is behind the demo</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-500">
          Next.js 16 App Router with server components, Prisma 7 against
          Postgres, Better Auth with role-aware guards, and server actions with
          zod validation. Multi-tenant scoping is enforced in the query layer and
          every admin decision writes an audit row.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/case-study"
            className="inline-flex h-10 items-center rounded-md bg-forest-700 px-4 text-sm font-bold text-white hover:bg-forest-800"
          >
            Read the case study
          </Link>
          <Link
            href="/properties"
            className="inline-flex h-10 items-center rounded-md border border-ink-900/15 bg-white px-4 text-sm font-bold text-ink-900 hover:bg-white/70"
          >
            Just browse the listings
          </Link>
        </div>
      </section>
    </div>
  );
}
