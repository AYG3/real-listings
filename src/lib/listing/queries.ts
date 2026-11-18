import prisma from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/client";
import { PAGE_SIZE, type SearchFilters } from "./filters";

/**
 * Sale/rent is stored in `attributes.transactionType` (the upload form has
 * always collected it). Phase 3 promotes it to a real column; until then the
 * filter reads the JSON path so discovery works against existing rows.
 */
const TRANSACTION_TYPE_BY_INTENT = {
  SALE: "sale",
  RENT: "rent",
} as const;

function buildWhere(filters: SearchFilters): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = { status: "PUBLISHED" };

  if (filters.type) where.type = filters.type;

  if (filters.intent) {
    where.attributes = {
      path: ["transactionType"],
      equals: TRANSACTION_TYPE_BY_INTENT[filters.intent],
    };
  }

  if (filters.state) {
    where.state = { equals: filters.state, mode: "insensitive" };
  }

  // A city-only filter would silently outrank a broader state search, so both
  // are applied independently and compose.
  if (filters.city) {
    where.city = { contains: filters.city, mode: "insensitive" };
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    where.price = {
      ...(filters.minPrice !== null ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== null ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" as const };
    where.OR = [
      { title: contains },
      { description: contains },
      { city: contains },
      { state: contains },
      { address: contains },
    ];
  }

  return where;
}

function buildOrderBy(
  sort: SearchFilters["sort"],
): Prisma.ListingOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price-desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

const cardInclude = {
  images: { orderBy: { order: "asc" }, take: 1 },
  agent: { select: { id: true, name: true, image: true } },
} satisfies Prisma.ListingInclude;

export type ListingCardData = Prisma.ListingGetPayload<{
  include: typeof cardInclude;
}>;

export type SearchResult = {
  items: ListingCardData[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

export async function searchListings(
  filters: SearchFilters,
): Promise<SearchResult> {
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: cardInclude,
      orderBy: buildOrderBy(filters.sort),
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    items,
    total,
    page: filters.page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getFeaturedListings(limit = 6): Promise<ListingCardData[]> {
  return prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type PublicStats = {
  listings: number;
  agents: number;
  cities: number;
};

/** Real counts for the hero. Never hardcode these. */
export async function getPublicStats(): Promise<PublicStats> {
  const [listings, agentGroups, cityGroups] = await Promise.all([
    prisma.listing.count({ where: { status: "PUBLISHED" } }),
    prisma.listing.groupBy({
      by: ["agentId"],
      where: { status: "PUBLISHED" },
    }),
    prisma.listing.groupBy({
      by: ["city"],
      where: { status: "PUBLISHED" },
    }),
  ]);

  return {
    listings,
    agents: agentGroups.length,
    cities: cityGroups.length,
  };
}

export type AgentDirectoryEntry = {
  id: string;
  name: string;
  image: string | null;
  city: string | null;
  state: string | null;
  listingCount: number;
};

export async function getAgentDirectory(): Promise<AgentDirectoryEntry[]> {
  const agents = await prisma.user.findMany({
    where: {
      role: "AGENT",
      listings: { some: { status: "PUBLISHED" } },
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: { select: { listings: { where: { status: "PUBLISHED" } } } },
      listings: {
        where: { status: "PUBLISHED" },
        select: { city: true, state: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  return agents.map((agent) => {
    const latest = agent.listings[0];
    return {
      id: agent.id,
      name: agent.name,
      image: agent.image,
      city: latest?.city ?? null,
      state: latest?.state ?? null,
      listingCount: agent._count.listings,
    };
  });
}

export type AgentProfile = {
  id: string;
  name: string;
  image: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  listings: ListingCardData[];
};

/** A public agent profile: only AGENT accounts with published listings exist. */
export async function getAgentProfile(
  id: string,
): Promise<AgentProfile | null> {
  const agent = await prisma.user.findFirst({
    where: { id, role: "AGENT", listings: { some: { status: "PUBLISHED" } } },
    select: {
      id: true,
      name: true,
      image: true,
      phone: true,
      listings: {
        where: { status: "PUBLISHED" },
        include: cardInclude,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!agent) return null;

  const latest = agent.listings[0];

  return {
    id: agent.id,
    name: agent.name,
    image: agent.image,
    phone: agent.phone,
    city: latest?.city ?? null,
    state: latest?.state ?? null,
    listings: agent.listings,
  };
}
