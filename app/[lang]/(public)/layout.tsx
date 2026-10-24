import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import type { NavSection } from "@/components/Navbar/Navbar"
import PublicArticleFrame from "@/components/PublicArticleFrame/PublicArticleFrame"

import { getNavbar } from "@/lib/navbar"

import styles from "./layout.module.css"

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
      .filter(link => !link.external && link.href.startsWith("/"))
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
