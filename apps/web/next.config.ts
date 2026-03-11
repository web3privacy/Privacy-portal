import type { NextConfig } from "next";
import path from "path";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
// Get workspace root (two levels up from apps/web)
const workspaceRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@web3privacy/portal-ui"],
  async redirects() {
    return [
      { source: "/news", destination: "/", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
    ],
  },
  ...(isVercel ? {} : { output: "standalone" }),
};

export default nextConfig;
