import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("keeps ordinary payloads parseable", () => {
    const html = serializeJsonLd({ "@type": "RealEstateListing", price: 185 });

    expect(JSON.parse(html)).toEqual({ "@type": "RealEstateListing", price: 185 });
  });

  it("neutralises a closing script tag in listing content", () => {
    const html = serializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });

    expect(html).not.toContain("<");
    expect(html).not.toContain("</script>");
    expect(JSON.parse(html).name).toBe('</script><img src=x onerror=alert(1)>');
  });

  it("escapes the line separators that break inlined JSON", () => {
    const html = serializeJsonLd({ description: "line\u2028sep\u2029ar" });

    expect(html).toContain("\\u2028");
    expect(html).toContain("\\u2029");
    expect(html).not.toContain("\u2028");
    expect(JSON.parse(html).description).toBe("line\u2028sep\u2029ar");
  });
});
