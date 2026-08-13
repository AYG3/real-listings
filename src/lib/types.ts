export type ListingTypeValue = "HOUSE" | "LAND"
export type ListingStatusValue =
  | "DRAFT"
  | "PUBLISHED"
  | "UNDER_OFFER"
  | "SOLD"
  | "RENTED"
  | "ARCHIVED";

  export interface ListingSummary {
  id: string;
  title: string;
  type: ListingTypeValue;
  status: ListingStatusValue;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
  coverImage?: string | null;
}

export interface CreateListingInput {
  title: string;
  description: string;
  type: ListingTypeValue;
  status?: ListingStatusValue;
  price: number;
  currency?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  slug: string;
  agentId: string;
  attributes?: Record<string, unknown>;
}

export type Role = "BUYER" | "ADMIN" | "AGENT"