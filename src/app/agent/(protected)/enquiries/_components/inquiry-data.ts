export type InquiryStatusValue =
  | "NEW"
  | "CONTACTED"
  | "VIEWING_SCHEDULED"
  | "CLOSED";

export type InquiryRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string;
  status: InquiryStatusValue;
  agentNote: string | null;
  listingTitle: string;
  listingId: string;
  age: string;
};
