import type { MetadataRoute } from "next"

import type { NavSection } from "@/components/Navbar/Navbar"
import { hiddenRoutes } from "@/lib/featureFlags"
import { getNavbar } from "@/lib/navbar"

const baseUrl = "https://tko-aly.fi"
const languages = ["fi", "en"] as const

// Read the navbar at request time (it is edited from the admin UI).
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hidden = hiddenRoutes()
  const sections: NavSection[] = await getNavbar()

  const paths = new Set<string>(["", "/kalenteri", "/sivukartta"])
  for (const section of sections) {
    for (const link of section.links) {
      if (link.external || !link.href.startsWith("/")) continue
      if (hidden.includes(link.href)) continue
      paths.add(link.href)
    }
  }

  return [...paths].map(path => ({
    url: `${baseUrl}/fi${path}`,
    changeFrequency: "monthly" as const,
    alternates: {
      languages: Object.fromEntries(
        languages.map(lang => [lang, `${baseUrl}/${lang}${path}`]),
      ),
    },
  }))
}
