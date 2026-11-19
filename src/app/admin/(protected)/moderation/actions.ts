"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import {
  invalidateListingCache,
  recordAudit,
} from "@/lib/admin/moderation";

export type DecisionResult = { status: "success" | "error"; message: string };

const listingDecisionSchema = z.object({
  listingId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  reason: z.string().trim().max(1000).optional(),
});

const agentDecisionSchema = z.object({
  agentId: z.string().min(1),
  decision: z.enum(["VERIFIED", "REJECTED"]),
  reason: z.string().trim().max(1000).optional(),
});

function revalidatePublicSurfaces() {
  invalidateListingCache();
  revalidatePath("/properties");
  revalidatePath("/agents");
  revalidatePath("/admin/overview");
  revalidatePath("/admin/listings");
  revalidatePath("/admin/listings/pending");
  revalidatePath("/admin/agents");
  revalidatePath("/admin/agents/pending");
  revalidatePath("/admin/audit");
  revalidatePath("/agent/listings");
  revalidatePath("/agent/dashboard");
}

export async function decideListing(
  listingId: string,
  decision: string,
  reason?: string,
): Promise<DecisionResult> {
  const parsed = listingDecisionSchema.safeParse({ listingId, decision, reason });

  if (!parsed.success) {
    return { status: "error", message: "That decision is not valid." };
  }

  const session = await requireAdmin();

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: { id: true, slug: true, title: true, status: true },
  });

  if (!listing) {
    return { status: "error", message: "Listing not found." };
  }

  const trimmedReason = parsed.data.reason?.trim();

  if (parsed.data.decision !== "APPROVED" && !trimmedReason) {
    return {
      status: "error",
      message: "A reason is required when you reject or request changes.",
    };
  }

  const nextStatus =
    parsed.data.decision === "APPROVED" ? "PUBLISHED" : "DRAFT";

  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: nextStatus,
      publishedAt: parsed.data.decision === "APPROVED" ? new Date() : null,
      rejectionReason:
        parsed.data.decision === "CHANGES_REQUESTED" ? trimmedReason : null,
    },
  });

  await recordAudit({
    actorId: session.user.id,
    actorName: session.user.name ?? session.user.email,
    action:
      parsed.data.decision === "APPROVED"
        ? "LISTING_APPROVED"
        : parsed.data.decision === "REJECTED"
          ? "LISTING_REJECTED"
          : "LISTING_CHANGES_REQUESTED",
    targetType: "listing",
    targetId: listing.id,
    targetName: listing.title,
    fromStatus: listing.status,
    toStatus: nextStatus,
    note: trimmedReason ?? null,
  });

  revalidatePublicSurfaces();
  revalidatePath(`/properties/${listing.slug}`);

  return {
    status: "success",
    message:
      parsed.data.decision === "APPROVED"
        ? `"${listing.title}" is live.`
        : parsed.data.decision === "REJECTED"
          ? `"${listing.title}" was rejected.`
          : `Changes requested on "${listing.title}".`,
  };
}

export async function decideAgent(
  agentId: string,
  decision: string,
  reason?: string,
): Promise<DecisionResult> {
  const parsed = agentDecisionSchema.safeParse({ agentId, decision, reason });

  if (!parsed.success) {
    return { status: "error", message: "That decision is not valid." };
  }

  const session = await requireAdmin();

  const agent = await prisma.user.findUnique({
    where: { id: parsed.data.agentId },
    select: { id: true, name: true, role: true, agentStatus: true },
  });

  if (!agent || agent.role !== "AGENT") {
    return { status: "error", message: "Agent not found." };
  }

  const trimmedReason = parsed.data.reason?.trim();

  if (parsed.data.decision === "REJECTED" && !trimmedReason) {
    return { status: "error", message: "A reason is required to reject an agent." };
  }

  const nextStatus = parsed.data.decision === "VERIFIED" ? "VERIFIED" : "REJECTED";

  await prisma.user.update({
    where: { id: agent.id },
    data: {
      agentStatus: nextStatus,
      agentStatusReason: trimmedReason ?? null,
      agentReviewedAt: new Date(),
      verifiedAt: nextStatus === "VERIFIED" ? new Date() : null,
    },
  });

  await recordAudit({
    actorId: session.user.id,
    actorName: session.user.name ?? session.user.email,
    action: nextStatus === "VERIFIED" ? "AGENT_VERIFIED" : "AGENT_REJECTED",
    targetType: "agent",
    targetId: agent.id,
    targetName: agent.name,
    fromStatus: agent.agentStatus,
    toStatus: nextStatus,
    note: trimmedReason ?? null,
  });

  revalidatePublicSurfaces();
  revalidatePath(`/agents/${agent.id}`);

  return {
    status: "success",
    message:
      nextStatus === "VERIFIED"
        ? `${agent.name} is verified and can publish.`
        : `${agent.name} was rejected.`,
  };
}
