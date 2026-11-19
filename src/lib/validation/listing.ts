import { z } from "zod";
import { formFlag, formText } from "./common";

/**
 * A blank price must fail rather than coerce to zero — `z.coerce.number()`
 * turns "" and null into 0, which would publish a free house. Pasting a
 * formatted amount (₦250,000,000) is common enough to accept.
 */
const priceField = z
  .string()
  .trim()
  .min(1, "Enter a price in naira")
  .transform((value) => Number(value.replace(/[\s,₦]/g, "")))
  .refine((value) => Number.isFinite(value), { error: "Enter a price in naira" })
  .refine((value) => value >= 0, { error: "Price cannot be negative" })
  .refine((value) => value <= 1_000_000_000_000, { error: "That price is too large" });

const optionalCount = z.coerce.number().int().min(0).max(50).optional();
const optionalText = z.string().trim().max(160).optional();

/**
 * One schema for both listing forms — they render the same fields, so a single
 * definition means a rule cannot drift between "new" and "edit".
 */
export const listingInputSchema = z.object({
  title: z.string().trim().min(4, "Give the listing a title").max(160),
  description: z
    .string()
    .trim()
    .min(20, "Describe the property in at least 20 characters")
    .max(4_000),
  price: priceField,
  type: z.enum(["HOUSE", "LAND"]),
  transactionType: z.enum(["sale", "rent", "short-let"]),
  state: z.string().trim().min(2, "State is required").max(80),
  city: z.string().trim().min(2, "City is required").max(80),
  address: z.string().trim().min(4, "Street address is required").max(240),
  area: optionalText,
  landmark: optionalText,
  size: z.string().trim().max(40).optional(),
  sizeUnit: z.string().trim().max(20).optional(),
  yearBuilt: z.string().trim().max(10).optional(),
  negotiable: z.boolean(),
  bedrooms: optionalCount,
  bathrooms: optionalCount,
  toilets: optionalCount,
  parking: optionalCount,
});

export type ListingInput = z.infer<typeof listingInputSchema>;

/**
 * The purpose radio is optional in the markup, and an absent value means
 * "sale" — it is a presentation choice, not user input worth rejecting.
 */
function readPurpose(formData: FormData): "sale" | "rent" | "short-let" {
  const value = formText(formData.get("transactionType"));
  if (value === "rent") return "rent";
  if (value === "short-let") return "short-let";
  return "sale";
}

/** Raw form entries mapped onto the schema's field names. */
function readListingFields(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formText(formData.get("price")),
    type: formText(formData.get("type")) === "LAND" ? ("LAND" as const) : ("HOUSE" as const),
    transactionType: readPurpose(formData),
    state: formData.get("state"),
    city: formData.get("city"),
    address: formData.get("address"),
    area: formText(formData.get("area")) || undefined,
    landmark: formText(formData.get("landmark")) || undefined,
    size: formText(formData.get("size")) || undefined,
    sizeUnit: formText(formData.get("sizeUnit")) || undefined,
    yearBuilt: formText(formData.get("yearBuilt")) || undefined,
    negotiable: formFlag(formData.get("negotiable")),
    bedrooms: formText(formData.get("bedrooms")) || undefined,
    bathrooms: formText(formData.get("bathrooms")) || undefined,
    toilets: formText(formData.get("toilets")) || undefined,
    parking: formText(formData.get("parking")) || undefined,
  };
}

/**
 * Both listing forms submit a FormData, so the schema takes one directly. The
 * field mapping above is the only place a form entry becomes a number or a
 * boolean.
 */
export const listingFormSchema = z
  .custom<FormData>((value) => typeof FormData !== "undefined" && value instanceof FormData, {
    error: "Expected the listing form to be submitted.",
  })
  .transform(readListingFields)
  // The pipe boundary needs the object-typed input; the mapping above is what
  // guarantees the shape, so the widening cast is safe.
  .pipe(
    listingInputSchema as unknown as z.ZodType<
      ListingInput,
      ReturnType<typeof readListingFields>
    >,
  );

/** Convenience wrapper so tests and callers need not know about the pipe. */
export function readListingInput(formData: FormData) {
  return listingFormSchema.safeParse(formData);
}

/**
 * The `attributes` JSON column carried the type-specific fields before the
 * schema grew real columns. Normalising here keeps the write paths in one
 * place and drops undefined keys so the stored object stays small.
 */
export function toListingAttributes(input: ListingInput) {
  const attributes: Record<string, string | number | boolean> = {
    negotiable: input.negotiable,
    transactionType: input.transactionType,
  };

  for (const key of ["bedrooms", "bathrooms", "toilets", "parking"] as const) {
    if (input[key] !== undefined) attributes[key] = input[key];
  }

  for (const key of ["area", "landmark", "size", "sizeUnit", "yearBuilt"] as const) {
    if (input[key]) attributes[key] = input[key];
  }

  return attributes;
}
