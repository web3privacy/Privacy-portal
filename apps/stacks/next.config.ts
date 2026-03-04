import type { NextConfig } from "next";

const isNetlifyBuild = process.env.NETLIFY === "true";
const isVercelBuild = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const shouldUseStandalone = !(isNetlifyBuild || isVercelBuild);

const nextConfig: NextConfig = {
  transpilePackages: ["@web3privacy/portal-ui"],
  ...(shouldUseStandalone ? { output: "standalone" } : {}),
  basePath: "",
  outputFileTracingRoot: process.cwd(),
  images: {
    // TODO add appropriate setup
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
