import { describe, expect, it } from "vitest";
import {
  enquirySchema,
  fieldErrorsOf,
  inquiryUpdateSchema,
  mergeSavesSchema,
  saveToggleSchema,
} from "./index";

const validEnquiry = {
  listingId: "clx0000000000000000000000",
  name: "Ada Obi",
  email: "ada@example.com",
  phone: "+234 801 234 5678",
  message: "Is this duplex still available for a viewing this weekend?",
  website: "",
};

describe("enquirySchema", () => {
  it("accepts a complete enquiry", () => {
    expect(enquirySchema.safeParse(validEnquiry).success).toBe(true);
  });

  it("allows a blank phone number", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, phone: "" }).success).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    const parsed = enquirySchema.safeParse({ ...validEnquiry, name: "  Ada Obi  " });

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.name).toBe("Ada Obi");
  });

  it("rejects a bad email, a short message and an unusable phone", () => {
    const parsed = enquirySchema.safeParse({
      ...validEnquiry,
      email: "ada@",
      message: "too short",
      phone: "abc",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fields = fieldErrorsOf(parsed.error);
      expect(Object.keys(fields).sort()).toEqual(["email", "message", "phone"]);
    }
  });

  it("rejects a filled honeypot so bots are identified", () => {
    const parsed = enquirySchema.safeParse({ ...validEnquiry, website: "http://spam" });

    expect(parsed.success).toBe(false);
  });

  it("requires a listing id", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, listingId: " " }).success).toBe(false);
  });
});

describe("inquiryUpdateSchema", () => {
  it("accepts each status in the pipeline", () => {
    for (const status of ["NEW", "CONTACTED", "VIEWING_SCHEDULED", "CLOSED"]) {
      expect(
        inquiryUpdateSchema.safeParse({ inquiryId: "abc", status }).success,
      ).toBe(true);
    }
  });

  it("rejects a status outside the pipeline", () => {
    expect(
      inquiryUpdateSchema.safeParse({ inquiryId: "abc", status: "ARCHIVED" }).success,
    ).toBe(false);
  });
});

describe("save schemas", () => {
  it("needs a listing id to toggle a save", () => {
    expect(saveToggleSchema.safeParse({ listingId: "" }).success).toBe(false);
    expect(saveToggleSchema.safeParse({ listingId: "abc" }).success).toBe(true);
  });

  it("bounds the guest merge payload", () => {
    const tooMany = Array.from({ length: 201 }, (_, index) => `id-${index}`);

    expect(mergeSavesSchema.safeParse({ listingIds: tooMany }).success).toBe(false);
    expect(mergeSavesSchema.safeParse({ listingIds: ["a", "b"] }).success).toBe(true);
  });
});
