import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/penta-lab",
  assetPrefix: "/penta-lab",
  images: { unoptimized: true },
};

export default nextConfig;
