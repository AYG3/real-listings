import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  ListChecks,
  MessageSquare,
  ScrollText,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminOverview } from "@/lib/admin/moderation";

function BarChart({ points }: { points: { date: string; count: number }[] }) {
  const max = Math.max(1, ...points.map((point) => point.count));
  const total = points.reduce((sum, point) => sum + point.count, 0);

  return (
    <div>
      <div className="flex h-24 items-end gap-[3px]" role="img" aria-label={`${total} listings created in the last 30 days`}>
        {points.map((point) => (
          <div
            key={point.date}
            title={`${point.date}: ${point.count}`}
            className="flex-1 rounded-t bg-forest-700/80"
            style={{ height: `${Math.max(3, (point.count / max) * 100)}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-semibold text-gray-500">
        {total} listing{total === 1 ? "" : "s"} created in the last 30 days · peak{" "}
        {max}/day
      </p>
    </div>
  );
}

const actionLabels: Record<string, string> = {
  LISTING_APPROVED: "approved a listing",
  LISTING_REJECTED: "rejected a listing",
  LISTING_CHANGES_REQUESTED: "requested listing changes",
  LISTING_PUBLISHED: "published a listing",
  LISTING_UNPUBLISHED: "unpublished a listing",
  LISTING_ARCHIVED: "archived a listing",
  AGENT_VERIFIED: "verified an agent",
  AGENT_REJECTED: "rejected an agent",
  ROLE_CHANGED: "changed a role",
};

function ago(date: Date) {
  const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function AdminOverviewPage() {
  await requireAdmin();
  const overview = await getAdminOverview();

  const stats = [
    {
      label: "Listings",
      value: String(overview.listings.total),
      detail: `${overview.listings.published} live`,
      icon: Building2,
      tone: "default",
    },
    {
      label: "Waiting for review",
      value: String(overview.queue.listings),
      detail: "Drafts",
      icon: Clock3,
      tone: "amber",
    },
    {
      label: "Agents",
      value: String(overview.agents.total),
      detail: `${overview.agents.pending} pending · ${overview.agents.verified} verified`,
      icon: BadgeCheck,
      tone: "green",
    },
    {
      label: "Enquiries",
      value: String(overview.inquiries.total),
      detail: `${overview.inquiries.thisWeek} this week`,
      icon: MessageSquare,
      tone: "default",
    },
  ] as const;

  const toneStyles = {
    default: "border-gray-200 bg-white",
    green: "border-emerald-200 bg-emerald-50/70",
    amber: "border-amber-200 bg-amber-50",
  } as const;

  const quickActions = [
    {
      label: `Review ${overview.queue.listings} pending listing${overview.queue.listings === 1 ? "" : "s"}`,
      href: "/admin/moderation",
      icon: ListChecks,
    },
    {
      label: `Verify ${overview.queue.agents} agent${overview.queue.agents === 1 ? "" : "s"}`,
      href: "/admin/moderation?tab=agents",
      icon: BadgeCheck,
    },
    { label: "Browse all listings", href: "/admin/listings", icon: Building2 },
    { label: "Open the audit log", href: "/admin/audit", icon: ScrollText },
  ];

  return (
    <div className="bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 lg:block">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Overview
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Live counts across the catalogue, the agents and the queue.
            </p>
          </div>

          <Link
            href="/admin/moderation"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-forest-800 sm:w-auto"
          >
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            Open the queue
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className={`min-h-40 rounded-lg border p-5 shadow-sm ${toneStyles[stat.tone]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-md border border-current/20 bg-white p-2 text-forest-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {stat.detail}
                  </span>
                </div>
                <p className="mt-6 text-sm font-semibold text-gray-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
                  {stat.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950">New listings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Submissions per day, last 30 days. {overview.buyers} buyer
                accounts and {overview.listings.archived} archived listings
                exist today.
              </p>
              <div className="mt-4">
                <BarChart points={overview.createdPerDay} />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">
                    Recent decisions
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Straight from the audit log.
                  </p>
                </div>
                <Link
                  href="/admin/audit"
                  className="inline-flex items-center gap-1 text-sm font-bold text-forest-700 hover:text-forest-800"
                >
                  Full log
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {overview.recentAudit.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm font-medium text-gray-500">
                  No decisions yet. Approving a listing or verifying an agent
                  writes the first entry here.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  {overview.recentAudit.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`flex gap-4 p-5 ${
                        index === overview.recentAudit.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                    >
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-forest-700">
                        {entry.action.startsWith("AGENT") ? (
                          <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold leading-6 text-gray-950">
                          {entry.actorName} {actionLabels[entry.action] ?? entry.action}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          {entry.targetName} <span className="text-gray-300">/</span>{" "}
                          {ago(entry.createdAt)}
                        </p>
                        {entry.note ? (
                          <p className="mt-1 text-sm text-gray-600">“{entry.note}”</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 space-y-6">
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-950">Quick actions</h2>
              <div className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex min-h-16 items-center justify-between gap-4 rounded-lg border border-forest-700/20 bg-white px-4 py-3 text-forest-700 shadow-sm transition-colors hover:border-forest-700/45 hover:bg-emerald-50"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-700 text-white">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="truncate text-sm font-bold sm:text-base">
                          {action.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950">
                <Users className="h-5 w-5 text-forest-700" aria-hidden="true" />
                People
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">Buyers</dt>
                  <dd className="font-bold text-gray-950">{overview.buyers}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">Verified agents</dt>
                  <dd className="font-bold text-gray-950">{overview.agents.verified}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">Pending agents</dt>
                  <dd className="font-bold text-amber-700">{overview.agents.pending}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
