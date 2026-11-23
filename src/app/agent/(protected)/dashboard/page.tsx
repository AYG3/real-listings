import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react";
import { requireAgent } from "@/lib/auth/guards";
import { getAgentDashboard } from "@/lib/agent/dashboard";
import { formatRelativeTime } from "@/lib/format";

const quickActions = [
  { label: "Create a new listing", href: "/agent/listings/create", icon: Plus },
  {
    label: "Open the enquiry inbox",
    href: "/agent/enquiries",
    icon: MessageSquare,
  },
  { label: "Edit your profile", href: "/agent/profile", icon: Building2 },
];

function Sparkline({ points }: { points: { date: string; views: number }[] }) {
  const width = 320;
  const height = 64;
  const max = Math.max(1, ...points.map((point) => point.views));
  const step = points.length > 1 ? width / (points.length - 1) : width;

  const path = points
    .map((point, index) => {
      const x = Math.round(index * step);
      const y = Math.round(height - (point.views / max) * (height - 6) - 3);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const total = points.reduce((sum, point) => sum + point.views, 0);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-16 w-full"
        role="img"
        aria-label={`Views over the last 14 days, ${total} total`}
        preserveAspectRatio="none"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-forest-700"
        />
      </svg>
      <p className="mt-2 text-xs font-semibold text-gray-500">
        {total} view{total === 1 ? "" : "s"} in the last 14 days · peak {max}/day
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Building2;
  tone?: "default" | "green" | "amber";
}) {
  const tones = {
    default: "border-gray-200 bg-white text-gray-950",
    green: "border-emerald-200 bg-emerald-50/70 text-forest-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return (
    <article className={`min-h-40 rounded-lg border p-5 shadow-sm ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-md border border-current/20 bg-white p-2">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-xs font-semibold opacity-80">{detail}</span>
      </div>
      <p className="mt-6 text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight">{value}</p>
    </article>
  );
}

export default async function AgentDashboardPage() {
  const session = await requireAgent();
  const dashboard = await getAgentDashboard(session.user.id);
  const { totals, views, inquiries, conversion } = dashboard;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 lg:block">
              Agent
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Live figures for your own listings only.
            </p>
          </div>

          <Link
            href="/agent/listings/create"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-forest-800 sm:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New listing
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Building2}
            label="Listings"
            value={String(totals.listings)}
            detail={`${totals.archived} archived`}
          />
          <StatCard
            icon={CheckCircle2}
            label="Live listings"
            value={String(totals.published)}
            detail={`${totals.closed} closed`}
            tone="green"
          />
          <StatCard
            icon={Clock3}
            label="Awaiting review"
            value={String(totals.drafts)}
            detail="Drafts"
            tone="amber"
          />
          <StatCard
            icon={MessageSquare}
            label="Enquiries"
            value={String(inquiries.total)}
            detail={`${inquiries.thisMonth} this month`}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-950">
                    Views and enquiries
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {views.total} total view{views.total === 1 ? "" : "s"} across
                    your listings.
                  </p>
                </div>
                <p className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-bold text-forest-700">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  {conversion === null
                    ? "No views yet"
                    : `${conversion}% enquiry rate`}
                </p>
              </div>
              <div className="mt-4">
                <Sparkline points={views.sparkline} />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-950">
                  Recent activity
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enquiries and listing changes, newest first.
                </p>
              </div>

              {dashboard.activity.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm font-medium text-gray-500">
                  Nothing has happened yet. Enquiries and listing updates appear
                  here as they arrive.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  {dashboard.activity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex gap-4 p-5 ${
                        index === dashboard.activity.length - 1
                          ? ""
                          : "border-b border-gray-100"
                      }`}
                    >
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-forest-700">
                        {activity.kind === "inquiry" ? (
                          <MessageSquare className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Building2 className="h-5 w-5" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold leading-6 text-gray-950">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          {activity.meta} <span className="text-gray-300">/</span>{" "}
                          {formatRelativeTime(activity.at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-950">Quick actions</h2>
              <p className="mt-1 text-sm text-gray-500">
                Shortcuts for common tasks.
              </p>
            </div>

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

            {inquiries.unread > 0 ? (
              <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                {inquiries.unread} enquir{inquiries.unread === 1 ? "y" : "ies"}{" "}
                still {inquiries.unread === 1 ? "needs" : "need"} a first reply.
              </p>
            ) : null}
          </aside>
        </section>
      </div>
    </div>
  );
}
