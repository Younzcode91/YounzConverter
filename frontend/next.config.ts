import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server is commonly opened through 127.0.0.1 on Windows.
  // Allow Next.js HMR/static resources from that origin as well as localhost.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
