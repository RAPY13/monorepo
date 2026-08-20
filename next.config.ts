import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },

  images: {
    qualities: [75, 100],
  },
};

export default nextConfig;
