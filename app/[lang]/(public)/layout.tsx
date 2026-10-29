import { existsSync } from "node:fs"
import { join } from "node:path"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import type { NavSection } from "@/components/Navbar/Navbar"
import PublicArticleFrame from "@/components/PublicArticleFrame/PublicArticleFrame"

import { getNavbar } from "@/lib/navbar"

import styles from "./layout.module.css"

const publicDir = join(process.cwd(), "app", "[lang]", "(public)")
const isArticle = (href: string) =>
  href.startsWith("/") && existsSync(join(publicDir, href, "page.md"))

export default async function PublicLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const lang = (await params).lang === "en" ? "en" : "fi"
  const sections: NavSection[] = await getNavbar()
  const articles = sections.flatMap(section =>
    section.links
      .filter(link => !link.external && isArticle(link.href))
      .map(link => ({
        href: link.href,
        title: link.labels[lang] ?? link.labels.fi,
      })),
  )

  return (
    <>
      <Navbar />
      <div className={styles.layoutWrapper}>
        <PublicArticleFrame articles={articles}>{children}</PublicArticleFrame>
      </div>
      <Footer />
    </>
  )
}
