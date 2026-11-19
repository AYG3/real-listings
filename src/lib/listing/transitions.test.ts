import { describe, expect, it } from "vitest";
import {
  canTransitionListing,
  isListingStatus,
  listingStatusSchema,
  nextListingStatuses,
} from "./transitions";

describe("canTransitionListing", () => {
  it("lets an agent publish or archive a draft", () => {
    expect(canTransitionListing("DRAFT", "PUBLISHED")).toBe(true);
    expect(canTransitionListing("DRAFT", "ARCHIVED")).toBe(true);
  });

  it("refuses to move a draft straight to sold", () => {
    expect(canTransitionListing("DRAFT", "SOLD")).toBe(false);
  });

  it("lets a published listing record its outcome", () => {
    expect(canTransitionListing("PUBLISHED", "UNDER_OFFER")).toBe(true);
    expect(canTransitionListing("PUBLISHED", "SOLD")).toBe(true);
    expect(canTransitionListing("PUBLISHED", "RENTED")).toBe(true);
  });

  it("only restores an archived listing to draft", () => {
    expect(canTransitionListing("ARCHIVED", "DRAFT")).toBe(true);
    expect(canTransitionListing("ARCHIVED", "PUBLISHED")).toBe(false);
  });

  it("treats a no-op and unknown values as illegal", () => {
    expect(canTransitionListing("PUBLISHED", "PUBLISHED")).toBe(false);
    expect(canTransitionListing("PUBLISHED", "DELETED")).toBe(false);
    expect(canTransitionListing("nonsense", "DRAFT")).toBe(false);
  });
});

describe("listingStatusSchema", () => {
  it("accepts the six statuses", () => {
    for (const status of ["DRAFT", "PUBLISHED", "UNDER_OFFER", "SOLD", "RENTED", "ARCHIVED"]) {
      expect(listingStatusSchema.safeParse({ listingId: "abc", status }).success).toBe(true);
    }
  });

  it("rejects an id-less payload", () => {
    expect(listingStatusSchema.safeParse({ listingId: "", status: "SOLD" }).success).toBe(false);
  });
});

describe("helpers", () => {
  it("narrows statuses", () => {
    expect(isListingStatus("PUBLISHED")).toBe(true);
    expect(isListingStatus("public")).toBe(false);
    expect(isListingStatus(undefined)).toBe(false);
  });

  it("lists the reachable next statuses", () => {
    expect(nextListingStatuses("DRAFT")).toEqual(["PUBLISHED", "ARCHIVED"]);
    expect(nextListingStatuses("nonsense")).toEqual([]);
  });
});
