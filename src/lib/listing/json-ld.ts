/**
 * Serialises JSON-LD for a `<script type="application/ld+json">` block.
 *
 * `</script>` inside any string would terminate the block, so `<` is escaped to
 * its JSON unicode form. U+2028/U+2029 are escaped too: they are valid in JSON
 * but historically break JavaScript parsers that inline JSON.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
