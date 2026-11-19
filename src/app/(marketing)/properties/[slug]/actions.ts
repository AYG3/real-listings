"use server";

import { headers } from "next/headers";
import { getSession } from "@/lib/auth/guards";
import { checkRateLimit, clientKey } from "@/lib/listing/inquiry";
import {
  enquirySchema,
  fieldErrorsOf,
  mergeSavesSchema,
  saveToggleSchema,
} from "@/lib/validation";
import prisma from "@/lib/prisma";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";

export type EnquiryState = {
  status: "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
} | null;

const DUPLICATE_WINDOW_MS = 10 * 60 * 1_000;

async function demoRefusalForSession() {
  const session = await getSession();
  if (isDemoSessionUser(session?.user)) {
    return {
      status: "error" as const,
      message: DEMO_READ_ONLY_MESSAGE,
    };
  }
  return null;
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const blocked = await demoRefusalForSession();
  if (blocked) return blocked;

  const parsed = enquirySchema.safeParse({
    listingId: formData.get("listingId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }

  const data = parsed.data;

  // Honeypot hit: report success so bots get no signal, write nothing.
  if (data.website) {
    return {
      status: "success",
      message: "Thanks — the agent will be in touch shortly.",
    };
  }

  const limit = checkRateLimit(clientKey(await headers()));
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many enquiries from this connection. Try again in about ${limit.retryAfterMinutes} minute${limit.retryAfterMinutes === 1 ? "" : "s"}.`,
    };
  }

  const listing = await prisma.listing.findFirst({
    where: { id: data.listingId, status: "PUBLISHED" },
    select: { id: true },
  });

  if (!listing) {
    return {
      status: "error",
      message: "This listing is no longer available for enquiries.",
    };
  }

  const duplicate = await prisma.inquiry.findFirst({
    where: {
      listingId: listing.id,
      email: data.email,
      createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    },
    select: { id: true },
  });

  if (duplicate) {
    return {
      status: "success",
      message:
        "We already have your enquiry for this property. The agent will be in touch.",
    };
  }

  const session = await getSession();

  await prisma.inquiry.create({
    data: {
      listingId: listing.id,
      buyerId: session?.user.id ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    },
  });

  return {
    status: "success",
    message:
      session?.user
        ? "Enquiry sent. The agent usually replies within one business day."
        : "Enquiry sent. The agent usually replies within one business day — check your inbox, including spam.",
  };
}

export type SavedResult = {
  saved: boolean;
  requiresAuth?: boolean;
  demoReadOnly?: boolean;
};

export async function toggleSavedListing(
  listingId: string,
  save: boolean,
): Promise<SavedResult> {
  const parsed = saveToggleSchema.safeParse({ listingId });
  if (!parsed.success) return { saved: false, requiresAuth: true };

  const session = await getSession();

  if (!session?.user) return { saved: false, requiresAuth: true };

  if (isDemoSessionUser(session.user)) {
    return { saved: save, demoReadOnly: true };
  }

  const target = parsed.data.listingId;

  if (save) {
    await prisma.savedListing.upsert({
      where: {
        userId_listingId: { userId: session.user.id, listingId: target },
      },
      update: {},
      create: { userId: session.user.id, listingId: target },
    });
  } else {
    await prisma.savedListing.deleteMany({
      where: { userId: session.user.id, listingId: target },
    });
  }

  return { saved: save };
}

/** Called once after sign-in to fold anonymous localStorage saves into the DB. */
export async function mergeGuestSaves(
  listingIds: string[],
): Promise<{ merged: number }> {
  const parsed = mergeSavesSchema.safeParse({ listingIds });
  if (!parsed.success) return { merged: 0 };

  const session = await getSession();
  if (!session?.user || parsed.data.listingIds.length === 0) return { merged: 0 };

  const candidates = [...new Set(parsed.data.listingIds)].slice(0, 50);

  const published = await prisma.listing.findMany({
    where: { id: { in: candidates }, status: "PUBLISHED" },
    select: { id: true },
  });

  if (published.length > 0) {
    await prisma.savedListing.createMany({
      data: published.map((listing) => ({
        userId: session.user.id,
        listingId: listing.id,
      })),
      skipDuplicates: true,
    });
  }

  return { merged: published.length };
}
