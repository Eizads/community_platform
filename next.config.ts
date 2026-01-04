import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */

  cacheComponents: true,
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
