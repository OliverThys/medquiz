import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuration pour Cloudflare Pages avec @cloudflare/next-on-pages
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;

