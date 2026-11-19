import prisma from "@/lib/prisma";
import { clearPublicCache } from "@/lib/listing/public-cache";

export type ListingDecision = "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";

export type AdminOverview = {
  listings: { total: number; published: number; drafts: number; archived: number };
  agents: { total: number; pending: number; verified: number };
  buyers: number;
  inquiries: { total: number; thisWeek: number };
  queue: { listings: number; agents: number };
  createdPerDay: { date: string; count: number }[];
  recentAudit: {
    id: string;
    actorName: string;
    action: string;
    targetName: string;
    createdAt: Date;
    note: string | null;
  }[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const weekAgo = new Date(Date.now() - 7 * DAY_MS);
  const monthStart = new Date(Date.now() - 29 * DAY_MS);
  monthStart.setHours(0, 0, 0, 0);

  const [
    listingGroups,
    agentGroups,
    buyers,
    inquiryTotals,
    inquiriesThisWeek,
    createdRows,
    recentAudit,
  ] = await Promise.all([
    prisma.listing.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.user.groupBy({
      by: ["agentStatus"],
      where: { role: "AGENT" },
      _count: { _all: true },
    }),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.listing.findMany({
      where: { createdAt: { gte: monthStart } },
      select: { createdAt: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        actorName: true,
        action: true,
        targetName: true,
        createdAt: true,
        note: true,
      },
    }),
  ]);

  const listingCount = (status: string) =>
    listingGroups.find((group) => group.status === status)?._count._all ?? 0;

  const agentCount = (status: string) =>
    agentGroups.find((group) => group.agentStatus === status)?._count._all ?? 0;

  const bucket = new Map<string, number>();
  for (let offset = 0; offset < 30; offset += 1) {
    bucket.set(dayKey(new Date(monthStart.getTime() + offset * DAY_MS)), 0);
  }
  for (const row of createdRows) {
    const key = dayKey(row.createdAt);
    if (bucket.has(key)) bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }

  const totalAgents = agentGroups.reduce((sum, group) => sum + group._count._all, 0);

  return {
    listings: {
      total: listingGroups.reduce((sum, group) => sum + group._count._all, 0),
      published: listingCount("PUBLISHED"),
      drafts: listingCount("DRAFT"),
      archived: listingCount("ARCHIVED"),
    },
    agents: {
      total: totalAgents,
      pending: agentCount("PENDING"),
      verified: agentCount("VERIFIED"),
    },
    buyers,
    inquiries: { total: inquiryTotals, thisWeek: inquiriesThisWeek },
    queue: {
      listings: listingCount("DRAFT"),
      agents: agentCount("PENDING"),
    },
    createdPerDay: [...bucket.entries()].map(([date, count]) => ({ date, count })),
    recentAudit,
  };
}

export type ModerationListing = {
  id: string;
  slug: string;
  title: string;
  status: string;
  price: string;
  city: string;
  state: string;
  type: string;
  intent: string;
  submittedAt: Date;
  agentName: string;
  agentEmail: string;
  agentStatus: string | null;
  cover: string | null;
  rejectionReason: string | null;
  description: string;
};

export async function getModerationQueue(): Promise<ModerationListing[]> {
  const rows = await prisma.listing.findMany({
    where: { status: "DRAFT" },
    orderBy: { createdAt: "asc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      agent: {
        select: { name: true, email: true, agentStatus: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    price: String(row.price),
    city: row.city,
    state: row.state,
    type: row.type,
    intent: row.intent,
    submittedAt: row.createdAt,
    agentName: row.agent.name,
    agentEmail: row.agent.email,
    agentStatus: row.agent.agentStatus,
    cover: row.images[0]?.url ?? null,
    rejectionReason: row.rejectionReason,
    description: row.description,
  }));
}

export type VerificationAgent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  agencyName: string | null;
  bio: string | null;
  image: string | null;
  agentStatus: string | null;
  agentStatusReason: string | null;
  createdAt: Date;
  listingCount: number;
  publishedCount: number;
};

export async function getVerificationQueue(): Promise<VerificationAgent[]> {
  const rows = await prisma.user.findMany({
    where: { role: "AGENT" },
    orderBy: [{ agentStatus: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      agencyName: true,
      bio: true,
      image: true,
      agentStatus: true,
      agentStatusReason: true,
      createdAt: true,
      listings: { select: { status: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    agencyName: row.agencyName,
    bio: row.bio,
    image: row.image,
    agentStatus: row.agentStatus,
    agentStatusReason: row.agentStatusReason,
    createdAt: row.createdAt,
    listingCount: row.listings.length,
    publishedCount: row.listings.filter((listing) => listing.status === "PUBLISHED")
      .length,
  }));
}

export type AuditEntry = {
  id: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  createdAt: Date;
};

export async function getAuditFeed(limit = 50): Promise<AuditEntry[]> {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      actorName: true,
      action: true,
      targetType: true,
      targetId: true,
      targetName: true,
      fromStatus: true,
      toStatus: true,
      note: true,
      createdAt: true,
    },
  });
}

type AuditInput = {
  actorId: string;
  actorName: string;
  action:
    | "LISTING_APPROVED"
    | "LISTING_REJECTED"
    | "LISTING_CHANGES_REQUESTED"
    | "LISTING_PUBLISHED"
    | "LISTING_UNPUBLISHED"
    | "LISTING_ARCHIVED"
    | "AGENT_VERIFIED"
    | "AGENT_REJECTED"
    | "ROLE_CHANGED";
  targetType: "listing" | "agent" | "user";
  targetId: string;
  targetName: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  note?: string | null;
};

export async function recordAudit(entry: AuditInput) {
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      actorName: entry.actorName,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      targetName: entry.targetName,
      fromStatus: entry.fromStatus ?? null,
      toStatus: entry.toStatus ?? null,
      note: entry.note ?? null,
    },
  });
}

/** Public pages read listings through a TTL cache; admin decisions must clear it. */
export function invalidateListingCache() {
  clearPublicCache("listing:");
}
