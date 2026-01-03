import type { NextConfig } from "next"

// Only use basePath in production (when deployed)
const isProduction = process.env.NODE_ENV === "production"
const basePath = isProduction ? "/buildflow-app" : ""

const nextConfig: NextConfig = {
  /* config options here */
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  cacheComponents: true,
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
