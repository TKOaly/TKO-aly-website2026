import type { MetadataRoute } from "next"

const baseUrl = "https://tko-aly.fi"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin and member areas, and the API, are not for search engines.
      disallow: ["/api/", "/fi/a/", "/en/a/", "/fi/u/", "/en/u/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
