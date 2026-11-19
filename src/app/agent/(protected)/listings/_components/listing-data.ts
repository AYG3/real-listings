export type ListingStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNDER_OFFER"
  | "SOLD"
  | "RENTED"
  | "ARCHIVED";

export type ListingType = "HOUSE" | "LAND";

export type AgentListing = {
  id: string;
  slug?: string;
  title: string;
  type: ListingType;
  status: ListingStatus;
  price: string;
  city: string;
  state: string;
  address: string;
  submittedAt: string;
  publishedAt?: string;
  bedrooms?: number;
  bathrooms?: number;
  size: string;
  coverTone: "green" | "amber" | "rose" | "gray";
  description: string;
  amenities: string[];
  images?: { url: string }[];
  views: number;
  inquiries: number;
  /** Epoch ms, for client-side sorting. */
  createdAt: number;
  /** Raw price in the listing currency, for client-side sorting. */
  priceValue: number;
  /** Feedback left by an admin on the last review, if any. */
  reviewNote: string | null;
};
