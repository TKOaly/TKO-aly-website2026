import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["beta.tko-aly.localhost"],
  transpilePackages: ["accept-language"],
}

export default nextConfig
