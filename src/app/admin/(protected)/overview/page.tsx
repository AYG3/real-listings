import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  Home,
  ListChecks,
  RefreshCw,
  UserCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Total listings",
    value: "312",
    detail: "+24 this month",
    icon: Building2,
    tone: "default",
  },
  {
    label: "Active listings",
    value: "248",
    detail: "79% published",
    icon: CheckCircle2,
    tone: "green",
  },
  {
    label: "Pending listings",
    value: "17",
    detail: "Needs review",
    icon: Clock3,
    tone: "amber",
  },
  {
    label: "Total agents",
    value: "64",
    detail: "12 verified",
    icon: UserCheck,
    tone: "default",
  },
  {
    label: "Pending agent approvals",
    value: "5",
    detail: "Oldest: 2 days",
    icon: Bell,
    tone: "rose",
  },
  {
    label: "Total buyers",
    value: "1,204",
    detail: "+86 this week",
    icon: Users,
    tone: "green",
  },
  {
    label: "New inquiries",
    value: "38",
    detail: "This week",
    icon: ListChecks,
    tone: "default",
  },
];

const activities = [
  {
    title: "3-bed duplex submitted in Gwarinpa, Abuja",
    meta: "by Agent Chidi Okafor",
    time: "2h ago",
    icon: Home,
  },
  {
    title: "New agent registered - Blessing Nnamdi",
    meta: "Port Harcourt",
    time: "5h ago",
    icon: UserCheck,
  },
  {
    title: "Inquiry on land listing in Lekki Phase 1",
    meta: "from buyer",
    time: "8h ago",
    icon: Bell,
  },
  {
    title: "Land listing submitted in Karu, Abuja",
    meta: "by Agent Musa Bello",
    time: "1d ago",
    icon: Building2,
  },
];

const quickActions = [
  {
    label: "Approve agents",
    href: "/admin/agents/pending",
    icon: UserCheck,
  },
  {
    label: "Review pending listings",
    href: "/admin/listings/pending",
    icon: Clock3,
  },
  {
    label: "View all listings",
    href: "/admin/listings",
    icon: Building2,
  },
  {
    label: "Add listing",
    href: "/admin/upload",
    icon: Home,
  },
];

const toneStyles = {
  default: {
    card: "border-gray-200 bg-white",
    icon: "border-gray-200 bg-gray-50 text-gray-600",
    label: "text-gray-500",
    value: "text-gray-950",
    detail: "text-gray-500",
  },
  green: {
    card: "border-emerald-200 bg-emerald-50/70",
    icon: "border-emerald-200 bg-white text-[#114b3d]",
    label: "text-emerald-800",
    value: "text-[#114b3d]",
    detail: "text-emerald-700",
  },
  amber: {
    card: "border-amber-200 bg-amber-50",
    icon: "border-amber-200 bg-white text-amber-700",
    label: "text-amber-800",
    value: "text-amber-700",
    detail: "text-amber-700",
  },
  rose: {
    card: "border-rose-200 bg-rose-50",
    icon: "border-rose-200 bg-white text-rose-700",
    label: "text-rose-800",
    value: "text-rose-700",
    detail: "text-rose-700",
  },
};

export default function AdminOverviewPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Overview
            </h1>
          </div>

          <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#114b3d]/25 bg-white px-4 text-sm font-semibold text-[#114b3d] shadow-sm transition-colors hover:bg-emerald-50 sm:w-auto">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const tone = toneStyles[stat.tone as keyof typeof toneStyles];

            return (
              <article
                key={stat.label}
                className={`min-h-40 rounded-lg border p-5 shadow-sm ${tone.card}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-md border p-2 ${tone.icon}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className={`text-xs font-semibold ${tone.detail}`}>
                    {stat.detail}
                  </span>
                </div>

                <div className="mt-6">
                  <p className={`text-sm font-semibold ${tone.label}`}>
                    {stat.label}
                  </p>
                  <p className={`mt-2 text-4xl font-bold tracking-tight ${tone.value}`}>
                    {stat.value}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Recent activity
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Latest movement across agents, listings, and inquiries.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              {activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.title}
                    className={`flex gap-4 p-5 ${
                      index === activities.length - 1 ? "" : "border-b border-gray-100"
                    }`}
                  >
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[#114b3d]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold leading-6 text-gray-950">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {activity.meta} <span className="text-gray-300">/</span>{" "}
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-950">
                Quick actions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Common review and listing workflows.
              </p>
            </div>

            <div className="grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex min-h-16 items-center justify-between gap-4 rounded-lg border border-[#114b3d]/20 bg-white px-4 py-3 text-[#114b3d] shadow-sm transition-colors hover:border-[#114b3d]/45 hover:bg-emerald-50"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#114b3d] text-white">
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
          </aside>
        </section>
      </div>
    </main>
  );
}
