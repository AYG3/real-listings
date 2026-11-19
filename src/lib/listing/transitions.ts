import { z } from "zod";
import { recordId } from "../validation/common";

export const listingStatuses = [
  "DRAFT",
  "PUBLISHED",
  "UNDER_OFFER",
  "SOLD",
  "RENTED",
  "ARCHIVED",
] as const;

export type ListingStatusName = (typeof listingStatuses)[number];

export const listingStatusSchema = z.object({
  listingId: recordId,
  status: z.enum(listingStatuses),
});

/**
 * Which statuses a listing may move to from its current one. Kept as data
 * rather than `if` chains so the rules can be read and tested on their own.
 * Publishing is a valid target here; the "agent must be verified to publish"
 * rule is enforced separately because it depends on the actor, not the state.
 */
const allowedTransitions: Record<ListingStatusName, readonly ListingStatusName[]> = {
  DRAFT: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["UNDER_OFFER", "SOLD", "RENTED", "DRAFT", "ARCHIVED"],
  UNDER_OFFER: ["PUBLISHED", "SOLD", "RENTED", "DRAFT", "ARCHIVED"],
  SOLD: ["PUBLISHED", "ARCHIVED"],
  RENTED: ["PUBLISHED", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

export function isListingStatus(value: unknown): value is ListingStatusName {
  return (
    typeof value === "string" &&
    (listingStatuses as readonly string[]).includes(value)
  );
}

export function canTransitionListing(from: string, to: string): boolean {
  if (!isListingStatus(from) || !isListingStatus(to)) return false;
  if (from === to) return false;

  return allowedTransitions[from].includes(to);
}

export function nextListingStatuses(from: string): readonly ListingStatusName[] {
  return isListingStatus(from) ? allowedTransitions[from] : [];
}
