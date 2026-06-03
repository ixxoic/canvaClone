import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fabric"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ]
  },
};

export default nextConfig;
