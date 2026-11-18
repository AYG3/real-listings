import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt =
  "Alara Estate — verified houses and land listings across Nigeria";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.colors.forest900,
          padding: "72px",
          color: brand.colors.white,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 18,
              background: brand.colors.forest700,
              border: "2px solid rgba(200,162,74,0.6)",
              fontSize: 34,
              fontWeight: 700,
              color: brand.colors.gold500,
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: brand.colors.ivory100,
            }}
          >
            Alara Estate
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            Verified houses and land, across Nigeria.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 860,
            }}
          >
            Search by city, price and type. Contact verified agents. A moderated
            marketplace, built end to end.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(200,162,74,0.35)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: brand.colors.gold500 }}>
            Next.js · Postgres · Prisma · Better Auth
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            alara.estate
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
