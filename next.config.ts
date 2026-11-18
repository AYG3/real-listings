import type { NextConfig } from "next";

const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dbf8kbius";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`https://res.cloudinary.com/${cloudinaryCloudName}/image/**`),
      new URL("https://images.unsplash.com/**"),
    ],
  },
};

export default nextConfig;
