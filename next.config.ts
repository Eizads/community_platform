import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  turbopack: {
    root: __dirname,
  },
}

export default withNextIntl(nextConfig)
