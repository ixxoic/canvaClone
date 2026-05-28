import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fabric"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ]
  }
};

export default nextConfig;
