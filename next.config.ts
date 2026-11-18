import type { NextConfig } from "next";

const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dbf8kbius";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
