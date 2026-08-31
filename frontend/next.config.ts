import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root — the monorepo also has a root-level package-lock.json
  // (for Railway's IaC tooling), which Turbopack would otherwise pick over this
  // directory when inferring the project root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
