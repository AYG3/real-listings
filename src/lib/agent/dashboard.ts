import prisma from "@/lib/prisma";

export type ViewsPoint = { date: string; views: number };

export type ActivityItem = {
  id: string;
  kind: "inquiry" | "listing";
  title: string;
  meta: string;
  at: Date;
};

export type AgentDashboard = {
  totals: {
    listings: number;
    published: number;
    drafts: number;
    closed: number;
    archived: number;
  };
  views: { total: number; sparkline: ViewsPoint[] };
  inquiries: { total: number; thisMonth: number; unread: number };
  conversion: number | null;
  activity: ActivityItem[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Every number on the agent dashboard comes from here — no placeholders. Views
 * are bucketed in JS because the 14-day window is at most a few hundred rows
 * per agent and a grouped-SQL variant would need another round trip.
 */
export async function getAgentDashboard(
  agentId: string,
): Promise<AgentDashboard> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const since = new Date(Date.now() - 13 * DAY_MS);
  since.setHours(0, 0, 0, 0);

  const [
    statusGroups,
    viewRows,
    viewTotals,
    inquiryTotals,
    monthInquiries,
    unread,
    recentInquiries,
    recentListings,
  ] = await Promise.all([
    prisma.listing.groupBy({
      by: ["status"],
      where: { agentId },
      _count: { _all: true },
    }),
    prisma.listingView.findMany({
      where: { listing: { agentId }, createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.listing.aggregate({ where: { agentId }, _sum: { viewCount: true } }),
    prisma.inquiry.count({ where: { listing: { agentId } } }),
    prisma.inquiry.count({
      where: { listing: { agentId }, createdAt: { gte: monthStart } },
    }),
    prisma.inquiry.count({ where: { listing: { agentId }, status: "NEW" } }),
    prisma.inquiry.findMany({
      where: { listing: { agentId } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        listing: { select: { title: true } },
      },
    }),
    prisma.listing.findMany({
      where: { agentId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { id: true, title: true, status: true, updatedAt: true },
    }),
  ]);

  const countFor = (status: string) =>
    statusGroups.find((group) => group.status === status)?._count._all ?? 0;

  const bucket = new Map<string, number>();
  for (let offset = 0; offset < 14; offset += 1) {
    bucket.set(dayKey(new Date(since.getTime() + offset * DAY_MS)), 0);
  }
  for (const row of viewRows) {
    const key = dayKey(row.createdAt);
    if (bucket.has(key)) bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }

  const sparkline: ViewsPoint[] = [...bucket.entries()].map(([date, views]) => ({
    date,
    views,
  }));

  const viewsTotal = viewTotals._sum.viewCount ?? 0;

  const activity: ActivityItem[] = [
    ...recentInquiries.map((inquiry) => ({
      id: `inquiry-${inquiry.id}`,
      kind: "inquiry" as const,
      title: `Enquiry on ${inquiry.listing.title}`,
      meta: `${inquiry.name ?? "A buyer"} · ${inquiry.status.toLowerCase().replace("_", " ")}`,
      at: inquiry.createdAt,
    })),
    ...recentListings.map((listing) => ({
      id: `listing-${listing.id}`,
      kind: "listing" as const,
      title: `${listing.title} — ${listing.status.toLowerCase().replace("_", " ")}`,
      meta: "Listing update",
      at: listing.updatedAt,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6);

  return {
    totals: {
      listings: statusGroups.reduce((sum, group) => sum + group._count._all, 0),
      published: countFor("PUBLISHED"),
      drafts: countFor("DRAFT"),
      closed: countFor("SOLD") + countFor("RENTED"),
      archived: countFor("ARCHIVED"),
    },
    views: { total: viewsTotal, sparkline },
    inquiries: { total: inquiryTotals, thisMonth: monthInquiries, unread },
    conversion:
      viewsTotal > 0
        ? Math.round((inquiryTotals / viewsTotal) * 1000) / 10
        : null,
    activity,
  };
}
