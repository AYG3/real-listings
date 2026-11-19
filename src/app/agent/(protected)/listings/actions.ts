"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { clearPublicCache } from "@/lib/listing/public-cache";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";

export type ListingActionResult = {
  status: "success" | "error";
  message: string;
};

const statusSchema = z.object({
  listingId: z.string().min(1),
  status: z.enum([
    "DRAFT",
    "PUBLISHED",
    "UNDER_OFFER",
    "SOLD",
    "RENTED",
    "ARCHIVED",
  ]),
});

/** Which statuses a listing may move to from its current one. */
const allowedTransitions: Record<string, string[]> = {
  DRAFT: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["UNDER_OFFER", "SOLD", "RENTED", "DRAFT", "ARCHIVED"],
  UNDER_OFFER: ["PUBLISHED", "SOLD", "RENTED", "DRAFT", "ARCHIVED"],
  SOLD: ["PUBLISHED", "ARCHIVED"],
  RENTED: ["PUBLISHED", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

const successMessages: Record<string, string> = {
  PUBLISHED: "Listing published.",
  DRAFT: "Listing moved back to draft.",
  UNDER_OFFER: "Listing marked as under offer.",
  SOLD: "Listing marked as sold.",
  RENTED: "Listing marked as rented.",
  ARCHIVED: "Listing archived.",
};

/**
 * Agents may only move their own listings, and only along the transitions
 * above. Publishing additionally requires a verified agent — that is the rule
 * that keeps unvetted accounts from putting listings on the public site.
 */
export async function updateListingStatus(
  listingId: string,
  status: string,
): Promise<ListingActionResult> {
  const parsed = statusSchema.safeParse({ listingId, status });

  if (!parsed.success) {
    return { status: "error", message: "That status is not available." };
  }

  const session = await requireAgent();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  const listing = await prisma.listing.findFirst({
    where: { id: parsed.data.listingId, agentId: session.user.id },
    select: { id: true, slug: true, status: true },
  });

  if (!listing) {
    return { status: "error", message: "Listing not found." };
  }

  if (listing.status === parsed.data.status) {
    return { status: "success", message: successMessages[status] ?? "Updated." };
  }

  const permitted = allowedTransitions[listing.status] ?? [];
  if (!permitted.includes(parsed.data.status)) {
    return {
      status: "error",
      message: `A ${listing.status.toLowerCase().replace("_", " ")} listing cannot be moved there.`,
    };
  }

  if (parsed.data.status === "PUBLISHED") {
    const agent = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agentStatus: true },
    });

    if (agent?.agentStatus !== "VERIFIED") {
      return {
        status: "error",
        message:
          "Your account is not verified yet, so listings stay in review. An admin will publish them.",
      };
    }
  }

  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: parsed.data.status,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined,
    },
  });

  // The cached public page, the directory and both agent surfaces read this row.
  clearPublicCache("listing:");
  revalidatePath("/properties");
  revalidatePath(`/properties/${listing.slug}`);
  revalidatePath("/agents");
  revalidatePath("/agent/listings");
  revalidatePath("/agent/dashboard");

  return { status: "success", message: successMessages[status] ?? "Updated." };
}
