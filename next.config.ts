import type { NextConfig } from "next"

import { SITE_URL } from "./lib/site"

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: SITE_URL },
}

export default nextConfig
