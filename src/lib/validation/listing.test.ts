import { describe, expect, it } from "vitest";
import {
  fieldErrorsOf,
  formFlag,
  formText,
  listingInputSchema,
  readListingInput,
  toListingAttributes,
} from "./index";

function formData(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.append(key, value);
  return data;
}

const validListing = {
  title: "Modern 4 bedroom duplex",
  description: "A bright duplex on a quiet street, five minutes from the expressway.",
  price: "250000000",
  type: "HOUSE",
  transactionType: "sale",
  state: "Lagos",
  city: "Lekki",
  address: "14 Admiralty Way",
  negotiable: true,
};

describe("form readers", () => {
  it("trims strings and treats blanks as empty", () => {
    expect(formText("  Lekki  ")).toBe("Lekki");
    expect(formText(null)).toBe("");
    expect(formText(new File([], "x.png"))).toBe("");
  });

  it("only treats an on/true value as checked", () => {
    expect(formFlag("on")).toBe(true);
    expect(formFlag("true")).toBe(true);
    expect(formFlag(null)).toBe(false);
    expect(formFlag("off")).toBe(false);
  });
});

describe("listingInputSchema", () => {
  it("accepts a well-formed listing and coerces the price", () => {
    const parsed = listingInputSchema.safeParse(validListing);

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.price).toBe(250_000_000);
  });

  it("rejects a short title, thin description and negative price", () => {
    const parsed = listingInputSchema.safeParse({
      ...validListing,
      title: "Hi",
      description: "too short",
      price: "-1",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fields = fieldErrorsOf(parsed.error);
      expect(fields.title).toBeTruthy();
      expect(fields.description).toBeTruthy();
      expect(fields.price).toBeTruthy();
    }
  });

  it("requires state, city and address", () => {
    const parsed = listingInputSchema.safeParse({
      ...validListing,
      state: "",
      city: "L",
      address: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fields = fieldErrorsOf(parsed.error);
      expect(Object.keys(fields).sort()).toEqual(["address", "city", "state"]);
    }
  });

  it("defaults an unknown purpose to sale instead of failing", () => {
    const parsed = readListingInput(
      formData({
        title: validListing.title,
        description: validListing.description,
        price: validListing.price,
        type: validListing.type,
        transactionType: "swap",
        state: validListing.state,
        city: validListing.city,
        address: validListing.address,
        negotiable: "on",
      }),
    );

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.transactionType).toBe("sale");
  });

  it("rejects a blank price instead of coercing it to zero", () => {
    const parsed = listingInputSchema.safeParse({ ...validListing, price: "" });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(fieldErrorsOf(parsed.error).price).toMatch(/price/i);
    }
  });

  it("accepts a pasted, formatted amount", () => {
    const parsed = listingInputSchema.safeParse({
      ...validListing,
      price: "₦250,000,000",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.price).toBe(250_000_000);
  });

  it("caps bedroom counts", () => {
    const parsed = listingInputSchema.safeParse({ ...validListing, bedrooms: "99" });

    expect(parsed.success).toBe(false);
  });
});

describe("readListingInput", () => {
  it("maps raw form strings onto the schema", () => {
    const parsed = readListingInput(
      formData({
        title: validListing.title,
        description: validListing.description,
        price: validListing.price,
        type: "LAND",
        transactionType: "rent",
        state: "Abuja",
        city: "Wuse",
        address: "12 Aminu Kano Crescent",
        negotiable: "on",
        bedrooms: "4",
      }),
    );

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.type).toBe("LAND");
      expect(parsed.data.transactionType).toBe("rent");
      expect(parsed.data.negotiable).toBe(true);
      expect(parsed.data.bedrooms).toBe(4);
      expect(parsed.data.area).toBeUndefined();
    }
  });

  it("reports the field a form left blank", () => {
    const parsed = readListingInput(formData({ title: "Modern duplex" }));

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(fieldErrorsOf(parsed.error).price).toBeTruthy();
    }
  });
});

describe("toListingAttributes", () => {
  it("keeps only populated fields", () => {
    const parsed = listingInputSchema.parse({
      ...validListing,
      bedrooms: "4",
      size: "420",
      // deliberately blank optionals
      landmark: undefined,
      yearBuilt: undefined,
    });

    expect(toListingAttributes(parsed)).toEqual({
      negotiable: true,
      transactionType: "sale",
      bedrooms: 4,
      size: "420",
    });
  });
});
