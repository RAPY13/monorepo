import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/feed", destination: "/api/proxy-auth?dest=/feed" },
      { source: "/feed/:path*", destination: "/api/proxy-auth?dest=/feed/:path*" },

      { source: "/profile", destination: "/api/proxy-auth?dest=/profile" },
      { source: "/profile/:path*", destination: "/api/proxy-auth?dest=/profile/:path*" },

      { source: "/battles", destination: "/api/proxy-auth?dest=/battles" },
      { source: "/battles/:path*", destination: "/api/proxy-auth?dest=/battles/:path*" },

      { source: "/booth", destination: "/api/proxy-auth?dest=/booth" },
      { source: "/booth/:path*", destination: "/api/proxy-auth?dest=/booth/:path*" },
    ];
  },
};

export default nextConfig;
