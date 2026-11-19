import type { NextConfig } from "next";

const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dbf8kbius";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: it is ~40% smaller than WebP at the same quality, which is
    // the difference between a 134 KB and a ~70 KB hero on the detail page.
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults `qualities` to [75] and silently coerces anything else,
    // so the hero's 62 has to be declared here to take effect.
    qualities: [62, 75],
    // Object form is required here: the URL form derives `search` from the URL,
    // which constrains src values to exactly no query string — and both
    // Cloudinary and Unsplash URLs carry query parameters.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${cloudinaryCloudName}/image/**`,
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Preset facets live on /properties; these are real 307s, not meta-refresh pages.
  async redirects() {
    return [
      { source: "/buy", destination: "/properties?intent=sale", permanent: false },
      { source: "/rent", destination: "/properties?intent=rent", permanent: false },
      { source: "/land", destination: "/properties?type=land", permanent: false },
    ];
  },
};

export default nextConfig;
