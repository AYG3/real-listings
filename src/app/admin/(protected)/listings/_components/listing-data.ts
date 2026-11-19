export type ListingStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNDER_OFFER"
  | "SOLD"
  | "RENTED"
  | "ARCHIVED";
export type ListingType = "HOUSE" | "LAND";

export type AdminListing = {
  id: string;
  title: string;
  type: ListingType;
  status: ListingStatus;
  price: string;
  city: string;
  state: string;
  address: string;
  agent: string;
  submittedAt: string;
  publishedAt?: string;
  bedrooms?: number;
  bathrooms?: number;
  size: string;
  coverTone: "green" | "amber" | "rose" | "gray";
  description: string;
  amenities: string[];
  images?: { url: string }[];
};
