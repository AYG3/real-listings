import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/agent/dashboard",
        "/agent/listings",
        "/agent/profile",
        "/api/",
      ],
    },
    sitemap: `${brand.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
