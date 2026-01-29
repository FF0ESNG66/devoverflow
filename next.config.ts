import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.britannica.com",
        port: "",
      }
    ]
  }
};

export default nextConfig;
