import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },

  // Add future Next.js options here if needed
};

export default nextConfig;