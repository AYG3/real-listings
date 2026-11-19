import { z } from "zod";
import { recordId } from "./common";

export const listingDecisionSchema = z.object({
  listingId: recordId,
  decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  reason: z.string().trim().max(1_000).optional(),
});

export const agentDecisionSchema = z.object({
  agentId: recordId,
  decision: z.enum(["VERIFIED", "REJECTED"]),
  reason: z.string().trim().max(1_000).optional(),
});

export const roleChangeSchema = z.object({
  userId: recordId,
  role: z.enum(["BUYER", "AGENT", "ADMIN"]),
});

/** Archive and restore take a bare id, so they still need a parse. */
export const listingIdSchema = z.object({
  listingId: recordId,
});

export const userIdSchema = z.object({
  userId: recordId,
});
