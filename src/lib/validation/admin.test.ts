import { describe, expect, it } from "vitest";
import {
  agentDecisionSchema,
  agentProfileSchema,
  fieldErrorsOf,
  listingDecisionSchema,
  listingIdSchema,
  roleChangeSchema,
} from "./index";

describe("listingDecisionSchema", () => {
  it("accepts the three moderation decisions", () => {
    for (const decision of ["APPROVED", "REJECTED", "CHANGES_REQUESTED"]) {
      expect(
        listingDecisionSchema.safeParse({ listingId: "abc", decision }).success,
      ).toBe(true);
    }
  });

  it("rejects an unknown decision", () => {
    expect(
      listingDecisionSchema.safeParse({ listingId: "abc", decision: "DELETED" }).success,
    ).toBe(false);
  });

  it("caps the reason so the audit log stays readable", () => {
    expect(
      listingDecisionSchema.safeParse({
        listingId: "abc",
        decision: "REJECTED",
        reason: "x".repeat(1_001),
      }).success,
    ).toBe(false);
  });
});

describe("agentDecisionSchema", () => {
  it("accepts verify and reject only", () => {
    expect(
      agentDecisionSchema.safeParse({ agentId: "a", decision: "VERIFIED" }).success,
    ).toBe(true);
    expect(
      agentDecisionSchema.safeParse({ agentId: "a", decision: "SUSPENDED" }).success,
    ).toBe(false);
  });
});

describe("roleChangeSchema", () => {
  it("accepts the three roles", () => {
    for (const role of ["BUYER", "AGENT", "ADMIN"]) {
      expect(roleChangeSchema.safeParse({ userId: "u", role }).success).toBe(true);
    }
  });

  it("rejects anything else, including lowercase", () => {
    expect(roleChangeSchema.safeParse({ userId: "u", role: "admin" }).success).toBe(false);
  });
});

describe("listingIdSchema", () => {
  it("rejects a blank id", () => {
    expect(listingIdSchema.safeParse({ listingId: "  " }).success).toBe(false);
  });
});

describe("agentProfileSchema", () => {
  const valid = { name: "Chidi Eze", phone: "+234 801 234 5678" };

  it("accepts a complete profile", () => {
    expect(agentProfileSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an empty phone but not a junk one", () => {
    expect(agentProfileSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);

    const parsed = agentProfileSchema.safeParse({ ...valid, phone: "call-me" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(fieldErrorsOf(parsed.error).phone).toBeTruthy();
  });

  it("requires a name of at least two characters", () => {
    expect(agentProfileSchema.safeParse({ ...valid, name: "C" }).success).toBe(false);
  });

  it("caps the bio so public profiles stay scannable", () => {
    expect(
      agentProfileSchema.safeParse({ ...valid, bio: "x".repeat(1_201) }).success,
    ).toBe(false);
  });
});
