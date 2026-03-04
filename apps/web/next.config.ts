import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const nextConfig: NextConfig = {
  transpilePackages: ["@web3privacy/portal-ui"],
  eslint: { ignoreDuringBuilds: true },
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
