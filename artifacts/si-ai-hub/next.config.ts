import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["*.picard.replit.dev", "*.replit.dev"],
};

export default nextConfig;
