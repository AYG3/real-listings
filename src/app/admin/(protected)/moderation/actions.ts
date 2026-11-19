"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import {
  invalidateListingCache,
  recordAudit,
} from "@/lib/admin/moderation";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";

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

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

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

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

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

const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["BUYER", "AGENT", "ADMIN"]),
});

/**
 * Role changes are the most dangerous admin action here, so they are guarded
 * three ways: admin-only, never against your own account, and always audited
 * with the previous role.
 */
export async function changeUserRole(
  userId: string,
  role: string,
): Promise<DecisionResult> {
  const parsed = roleSchema.safeParse({ userId, role });

  if (!parsed.success) {
    return { status: "error", message: "That role is not valid." };
  }

  const session = await requireAdmin();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  if (session.user.id === parsed.data.userId) {
    return {
      status: "error",
      message: "You cannot change your own role. Ask another admin.",
    };
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!target) {
    return { status: "error", message: "User not found." };
  }

  const label = target.name?.trim() || target.email;

  if (target.role === parsed.data.role) {
    return { status: "error", message: `${label} already has that role.` };
  }

  await prisma.user.update({
    where: { id: target.id },
    data: { role: parsed.data.role },
  });

  await recordAudit({
    actorId: session.user.id,
    actorName: session.user.name ?? session.user.email,
    action: "ROLE_CHANGED",
    targetType: "user",
    targetId: target.id,
    targetName: label,
    fromStatus: target.role,
    toStatus: parsed.data.role,
  });

  revalidatePublicSurfaces();
  revalidatePath("/admin/users");

  return {
    status: "success",
    message: `${label} is now ${parsed.data.role.toLowerCase()}.`,
  };
}

const listingIdSchema = z.object({ listingId: z.string().min(1) });

async function setArchived(
  listingId: string,
  archive: boolean,
): Promise<DecisionResult> {
  const parsed = listingIdSchema.safeParse({ listingId });

  if (!parsed.success) {
    return { status: "error", message: "That listing is not valid." };
  }

  const session = await requireAdmin();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: { id: true, slug: true, title: true, status: true },
  });

  if (!listing) {
    return { status: "error", message: "Listing not found." };
  }

  const nextStatus = archive ? "ARCHIVED" : "DRAFT";

  if (listing.status === nextStatus) {
    return {
      status: "error",
      message: archive ? "That listing is already archived." : "That listing is not archived.",
    };
  }

  await prisma.listing.update({
    where: { id: listing.id },
    data: { status: nextStatus, publishedAt: null },
  });

  await recordAudit({
    actorId: session.user.id,
    actorName: session.user.name ?? session.user.email,
    action: archive ? "LISTING_ARCHIVED" : "LISTING_UNPUBLISHED",
    targetType: "listing",
    targetId: listing.id,
    targetName: listing.title,
    fromStatus: listing.status,
    toStatus: nextStatus,
    note: archive ? null : "Restored from archive to draft for re-review.",
  });

  revalidatePublicSurfaces();
  revalidatePath(`/properties/${listing.slug}`);
  revalidatePath(`/admin/listings/${listing.id}`);

  return {
    status: "success",
    message: archive
      ? `"${listing.title}" archived and removed from public results.`
      : `"${listing.title}" restored to draft.`,
  };
}

export async function archiveListing(listingId: string) {
  return setArchived(listingId, true);
}

export async function restoreListing(listingId: string) {
  return setArchived(listingId, false);
}
