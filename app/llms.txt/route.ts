import type { NavSection } from "@/components/Navbar/Navbar"
import { hiddenRoutes } from "@/lib/featureFlags"
import { getNavbar } from "@/lib/navbar"

const baseUrl = "https://beta.tko-aly.fi"

// Built from the navbar, which is edited from the admin UI.
export const dynamic = "force-dynamic"

/** llms.txt (https://llmstxt.org): a Markdown overview of the site for language models. */
export async function GET() {
  const hidden = hiddenRoutes()
  const sections: NavSection[] = await getNavbar()

  const lines = [
    "# TKO-äly",
    "",
    "> TKO-äly ry on Helsingin yliopiston tietojenkäsittelytieteen ja datatieteen opiskelijoiden ainejärjestö, joka ajaa opiskelijoiden etua opintoasioissa ja järjestää moninaista vapaa-ajan toimintaa.",
    "",
    "The site is available in Finnish (/fi) and English (/en). Links below point to the Finnish pages; replace /fi with /en for the English version where a translation exists.",
    "",
    "## Main pages",
    "",
    `- [Etusivu](${baseUrl}/fi): Yhdistyksen etusivu`,
    `- [Tapahtumakalenteri](${baseUrl}/fi/kalenteri): Tulevat tapahtumat`,
    `- [Sivukartta](${baseUrl}/fi/sivukartta): Kaikki sivut yhdessä paikassa`,
  ]

  for (const section of sections) {
    const links = section.links.filter(
      link =>
        !link.external &&
        link.href.startsWith("/") &&
        !hidden.includes(link.href),
    )
    if (links.length === 0) continue

    lines.push("", `## ${section.labels.fi}`, "")
    const description = section.descriptions?.fi
    if (description) lines.push(description, "")
    for (const link of links) {
      lines.push(`- [${link.labels.fi}](${baseUrl}/fi${link.href})`)
    }
  }

  lines.push("", "## Optional", "", `- [English site](${baseUrl}/en)`, "")

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
