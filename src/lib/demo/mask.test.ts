import { describe, expect, it } from "vitest";
import {
  maskEmail,
  maskFreeText,
  maskName,
  maskPhone,
  maybeMask,
} from "./mask";

describe("maskEmail", () => {
  it.each([
    ["adaeze.okafor@alara.ng", "a••••••@alara.ng"],
    ["a@b.co", "a••••••@b.co"],
    ["  chidi@alara.ng  ", "c••••••@alara.ng"],
  ])("masks %s", (input, expected) => {
    expect(maskEmail(input)).toBe(expected);
  });

  it("never leaks the local-part length", () => {
    expect(maskEmail("a@x.io")).toBe(maskEmail("a-very-long-local-part@x.io"));
  });

  it("keeps null, empty and malformed input safe", () => {
    expect(maskEmail(null)).toBeNull();
    expect(maskEmail(undefined)).toBeNull();
    expect(maskEmail("")).toBe("");
    expect(maskEmail("not-an-email")).toBe("n••••••");
  });
});

describe("maskPhone", () => {
  it("keeps the country code and the last three digits", () => {
    expect(maskPhone("+234 801 234 5678")).toBe("+234 ••• ••• 678");
    expect(maskPhone("08012345678")).toBe("••• ••• 678");
  });

  it("falls back to a fixed placeholder for short input", () => {
    expect(maskPhone("12345")).toBe("••• ••••");
  });

  it("keeps null and empty input safe", () => {
    expect(maskPhone(null)).toBeNull();
    expect(maskPhone("")).toBe("");
  });
});

describe("maskName", () => {
  it("keeps the given name and the surname initial", () => {
    expect(maskName("Chidi Okafor")).toBe("Chidi O.");
    expect(maskName("Ngozi Ada Adeyemi")).toBe("Ngozi A.");
  });

  it("handles a single token and blanks", () => {
    expect(maskName("Chidi")).toBe("C••••••");
    expect(maskName(null)).toBeNull();
    expect(maskName("   ")).toBe("");
  });
});

describe("maskFreeText", () => {
  it("masks embedded emails and phone numbers", () => {
    const result = maskFreeText(
      "Call me on 0801 234 5678 or email chidi@alara.ng please.",
    );

    expect(result).toContain("c••••••@alara.ng");
    expect(result).toContain("••• ••• 678");
    expect(result).not.toContain("chidi@alara.ng");
    expect(result).not.toContain("0801 234 5678");
  });

  it("leaves dates, prices and short numbers untouched", () => {
    expect(maskFreeText("Viewing on 2026-11-19 at ₦96,000,000")).toBe(
      "Viewing on 2026-11-19 at ₦96,000,000",
    );
  });

  it("keeps null and empty input safe", () => {
    expect(maskFreeText(null)).toBeNull();
    expect(maskFreeText("")).toBe("");
  });
});

describe("maybeMask", () => {
  it("returns the original value for real sessions", () => {
    expect(maybeMask("a@b.co", false, (v) => maskEmail(v) ?? v)).toBe("a@b.co");
  });

  it("applies the mask for demo sessions", () => {
    expect(maybeMask("a@b.co", true, (v) => maskEmail(v) ?? v)).toBe(
      "a••••••@b.co",
    );
  });
});
