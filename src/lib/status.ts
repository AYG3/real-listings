export const listingStatusLabels = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  UNDER_OFFER: "Under Offer",
  SOLD: "Sold",
  RENTED: "Rented",
  ARCHIVED: "Archived",
} as const;

export type ListingStatusValue = keyof typeof listingStatusLabels;

export type StatusTone = "neutral" | "success" | "warning" | "info" | "danger";

export const listingStatusTones: Record<ListingStatusValue, StatusTone> = {
  DRAFT: "neutral",
  PUBLISHED: "success",
  UNDER_OFFER: "warning",
  SOLD: "info",
  RENTED: "info",
  ARCHIVED: "danger",
};

export const inquiryStatusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  VIEWING_SCHEDULED: "Viewing scheduled",
  CLOSED: "Closed",
} as const;

export type InquiryStatusValue = keyof typeof inquiryStatusLabels;

export const inquiryStatusTones: Record<InquiryStatusValue, StatusTone> = {
  NEW: "info",
  CONTACTED: "warning",
  VIEWING_SCHEDULED: "success",
  CLOSED: "neutral",
};

export function listingStatusLabel(status: string): string {
  return (
    listingStatusLabels[status as ListingStatusValue] ?? status.replace(/_/g, " ")
  );
}

export function listingStatusTone(status: string): StatusTone {
  return listingStatusTones[status as ListingStatusValue] ?? "neutral";
}
