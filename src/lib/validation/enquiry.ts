import { z } from "zod";
import { recordId } from "./common";

const trimmed = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

/** Guest or signed-in enquiry. Guests supply contact details; buyers may not. */
export const enquirySchema = z.object({
  listingId: recordId,
  name: z.preprocess(trimmed, z.string().min(2, "Please enter your name.").max(80)),
  email: z.preprocess(
    trimmed,
    z.email("Enter a valid email address.").max(160),
  ),
  phone: z.preprocess(
    trimmed,
    z
      .string()
      .max(24)
      .refine(
        (value) => value === "" || /^[+0-9][0-9 ()-]{6,23}$/.test(value),
        "Enter a valid phone number, or leave it blank.",
      ),
  ),
  message: z.preprocess(
    trimmed,
    z
      .string()
      .min(20, "Tell the agent a little more — at least 20 characters.")
      .max(2_000),
  ),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const inquiryStatuses = [
  "NEW",
  "CONTACTED",
  "VIEWING_SCHEDULED",
  "CLOSED",
] as const;

export const inquiryUpdateSchema = z.object({
  inquiryId: recordId,
  status: z.enum(inquiryStatuses),
  note: z.string().trim().max(2_000).optional(),
});

export const saveToggleSchema = z.object({
  listingId: recordId,
});

/** Ids collected in localStorage while logged out, merged after sign-in. */
export const mergeSavesSchema = z.object({
  listingIds: z.array(recordId).max(200),
});
