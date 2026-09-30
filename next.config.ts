import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@duckdb/node-api"],
};

export default nextConfig;
