import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Case study — Alara Estate",
  description:
    "How Alara Estate was built: the problem, the users, the architecture, three engineering decisions with their trade-offs, and what I would do next.",
};

const decisions = [
  {
    title: "Server components with query-level multi-tenancy",
    problem:
      "An agent workspace must never leak another agent's drafts or enquiries, and a client-side filter is not a security boundary.",
    choice:
      "Every agent and admin read goes through Prisma with an explicit owner predicate (`agentId: session.user.id`) or a nested relation filter (`listing: { agentId }`). Pages are server components, so the data never reaches the browser unless it is meant to.",
    good: "One code path per query, no fetch layer to keep in sync, and the guard fails closed.",
    bad: "Every new screen has to remember the predicate; there is no framework check that stops a missing one.",
  },
  {
    title: "Migration written by hand, applied through the app's adapter",
    problem:
      "Supabase's session pooler caps concurrent clients, so the Prisma CLI could not connect to generate or apply migrations, and the direct host does not resolve in this environment.",
    choice:
      "The migration SQL is authored by hand, applied inside a transaction through the `pg` adapter the app already uses, and recorded in `_prisma_migrations` with a SHA-256 of the file.",
    good: "Deployments stay reproducible, and `migrate deploy` sees the migration as applied.",
    bad: "No shadow-database drift detection; the checksum has to be recomputed by hand if the SQL changes.",
  },
  {
    title: "A bounded TTL cache instead of `unstable_cache`",
    problem:
      "A detail page paid three cross-region round trips per render, but the framework cache without Cache Components did not honour its own revalidate window.",
    choice:
      "A 15-second in-process TTL cache, cleared by every listing mutation, with unit tests around the TTL and the prefix invalidation.",
    good: "Predictable staleness bound, read-your-own-writes preserved, and no dependence on framework internals.",
    bad: "Per-instance: a multi-instance deployment needs a shared cache, which is why the TTL is short rather than absent.",
  },
];

const metrics = [
  { label: "Typecheck / lint / build", value: "clean", note: "tsc --noEmit, eslint --max-warnings=0, next build --webpack" },
  { label: "Unit tests", value: "6", note: "JSON-LD escaping, cache TTL + invalidation" },
  { label: "Detail page LCP", value: "3.0 s", note: "Lighthouse mobile; open item, budgeted for Phase 7" },
  { label: "CLS", value: "0", note: "Detail page, Lighthouse and CDP runs" },
  { label: "Seeded catalogue", value: "20 listings", note: "18 published, 2 drafts, 4 agents" },
  { label: "Admin decisions audited", value: "100%", note: "Every mutation writes an AuditLog row in the same action" },
];

export default function CaseStudyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
          Case study
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
          A three-sided property marketplace, built to be inspected
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-500">
          Alara Estate is a portfolio project: buyers discover verified houses
          and land, agents work their listings and enquiries, admins moderate
          the catalogue and verify agents. Everything on this page is
          implemented in the app you are looking at.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-forest-700 px-5 text-sm font-bold text-white hover:bg-forest-800"
          >
            Open the demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/properties"
            className="inline-flex h-11 items-center rounded-md border border-ink-900/15 bg-white px-5 text-sm font-bold text-ink-900 hover:bg-white/70"
          >
            Browse the catalogue
          </Link>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-ink-900">The problem</h2>
        <p className="mt-3 leading-relaxed text-ink-700">
          Nigerian property listings are noisy: duplicate posts, agents who
          never reply, photos that do not match the address. The product bet is
          that trust beats inventory — verified agents, moderated listings, and
          an enquiry that reaches exactly one person.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-900">The three users</h2>
        <ul className="mt-3 space-y-3">
          {[
            ["Buyer", "Search and filter without a query language, save properties, enquire without an account."],
            ["Agent", "Own only their own data, publish inside a state machine, work enquiries to a resolution."],
            ["Admin", "Moderate submissions, verify agents, and leave a trail for every decision."],
          ].map(([role, body]) => (
            <li key={role} className="rounded-card border border-ink-900/10 bg-white p-4">
              <p className="font-bold text-ink-900">{role}</p>
              <p className="mt-1 text-sm text-muted-500">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-900">Architecture</h2>
        <pre className="mt-3 overflow-x-auto rounded-card border border-ink-900/10 bg-surface p-4 text-xs leading-relaxed text-ink-800">
{`Browser
  │  forms + server actions (zod validated, role guarded)
  ▼
Next.js 16 App Router (server components, route handlers)
  │  requireAuth / requireAgent / requireAdmin, isDemoSessionUser
  ▼
Prisma 7  ──►  Postgres (Supabase pooler, bounded client pool)
  │
  └─ public listing reads are wrapped in a 15s TTL cache

Postgres tables: users · listings · listing_images · inquiries
                 listing_views · saved_listings · audit_logs
                 sessions · accounts · verifications`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-900">
          Three decisions, with the trade-offs
        </h2>
        <div className="mt-4 space-y-5">
          {decisions.map((decision) => (
            <article
              key={decision.title}
              className="rounded-card border border-ink-900/10 bg-white p-5"
            >
              <h3 className="text-lg font-bold text-ink-900">{decision.title}</h3>
              <p className="mt-2 text-sm text-muted-500">
                <span className="font-semibold text-ink-900">Problem. </span>
                {decision.problem}
              </p>
              <p className="mt-2 text-sm text-muted-500">
                <span className="font-semibold text-ink-900">Choice. </span>
                {decision.choice}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="flex gap-2 text-sm text-forest-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {decision.good}
                </p>
                <p className="flex gap-2 text-sm text-rose-800">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {decision.bad}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-900">Metrics</h2>
        <div className="mt-3 overflow-hidden rounded-card border border-ink-900/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">Measure</th>
                <th scope="col" className="px-4 py-3 font-bold">Value</th>
                <th scope="col" className="px-4 py-3 font-bold">How</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {metrics.map((metric) => (
                <tr key={metric.label} className="border-t border-ink-900/5">
                  <td className="px-4 py-3 font-semibold text-ink-900">{metric.label}</td>
                  <td className="px-4 py-3 font-bold text-forest-700">{metric.value}</td>
                  <td className="px-4 py-3 text-muted-500">{metric.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-900">What I would do next</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-700">
          <li>
            Cut the critical bundle so the detail page clears 2.5 s LCP on a
            throttled mobile profile — the measurement is in place, the budget is
            the remaining work.
          </li>
          <li>
            Email delivery for enquiries, with retries, so an enquiry is not only
            a database row.
          </li>
          <li>
            Replace the in-process TTL cache with a shared cache keyed by the same
            tag, once more than one instance is running.
          </li>
          <li>
            End-to-end coverage for the three critical paths: enquiry, publish,
            verification.
          </li>
        </ul>
      </section>
    </div>
  );
}
