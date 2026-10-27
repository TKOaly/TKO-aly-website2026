"use client"

import { ExternalLink, FolderOpen, Share2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import en from "@/locales/en.json"
import fi from "@/locales/fi.json"

import Card from "@/components/Cards/Card"
import Terminal from "@/components/Cards/Terminal"
import TableOfContents from "@/components/TableOfContents/TableOfContents"

import styles from "./PublicArticleFrame.module.css"

export type ArticleLink = { href: string; title: string }

export default function PublicArticleFrame({
  children,
  articles = [],
}: {
  children: ReactNode
  articles?: ArticleLink[]
}) {
  const pathname = usePathname()
  const [shared, setShared] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  // Expose the sidebar's distance from the top of the document so CSS can
  // size it to fit the viewport on first paint, before it becomes sticky.
  useEffect(() => {
    const page = pageRef.current
    const sidebar = sidebarRef.current
    if (!page || !sidebar) return

    const update = () => {
      // Measure the (non-sticky) grid parent: the sidebar itself is sticky, so
      // its own position shifts with scroll and would skew the offset.
      const anchor = sidebar.parentElement ?? sidebar
      const top = anchor.getBoundingClientRect().top + window.scrollY
      sidebar.style.setProperty("--sidebar-offset", `${Math.round(top)}px`)
    }
    update()

    const observer = new ResizeObserver(update)
    observer.observe(page)
    return () => observer.disconnect()
  }, [])
  const articlePath = pathname.replace(/^\/(fi|en)/, "") || "/"
  const articleName = articlePath.split("/").filter(Boolean).pop() || "index"
  const lang = pathname.startsWith("/en") ? "en" : "fi"
  const language = lang === "en" ? en : fi
  const currentIndex = articles.findIndex(a => a.href === articlePath)
  const previous = currentIndex > 0 ? articles[currentIndex - 1] : undefined
  const next =
    currentIndex >= 0 && currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : undefined
  const share = async () => {
    const shareData = { title: document.title, url: window.location.href }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
      setShared(true)
      window.setTimeout(() => setShared(false), 1800)
    } catch {
      setShared(false)
    }
  }

  return (
    <div ref={pageRef} className={styles.page}>
      <Card className={styles.metadataCard}>
        <div className={styles.metadata} aria-label="Article metadata">
          <span className={styles.path}>
            <FolderOpen size={16} aria-hidden /> ~/public/toiminta/{articleName}
            .md
          </span>
        </div>
      </Card>

      <div className={styles.contentGrid}>
        <aside ref={sidebarRef} className={styles.sidebar}>
          <Terminal
            className={styles.tocTerminal}
            barTitle="table of contents"
            heading=""
            mobileCollapsible={false}
          >
            <TableOfContents />
          </Terminal>
          <Card>
            <div className={styles.actions}>
              <button type="button" onClick={share}>
                <Share2 size={16} aria-hidden />{" "}
                {shared
                  ? language.publicArticle.linkCopied
                  : language.publicArticle.shareArticle}
              </button>
              <a
                href="https://github.com/tko-aly/tko-aly/tree/main/services/website2026"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} aria-hidden />{" "}
                {language.publicArticle.editOnGitHub}
              </a>
            </div>
          </Card>
        </aside>

        <main id="main-content" className={styles.article}>
          <Terminal
            barTitle={`${articleName}.md`}
            heading=""
            mobileCollapsible={false}
          >
            {children}
          </Terminal>
        </main>
      </div>

      {(previous || next) && (
        <nav
          className={styles.articleNav}
          aria-label={language.publicArticle.otherArticles}
        >
          {previous && (
            <Link
              href={`/${lang}${previous.href}`}
              className={styles.articleNavLink}
              rel="prev"
            >
              <span className={styles.articleNavLabel}>
                ← {language.publicArticle.previousArticle}
              </span>
              <span className={styles.articleNavTitle}>{previous.title}</span>
            </Link>
          )}
          {next && (
            <Link
              href={`/${lang}${next.href}`}
              className={`${styles.articleNavLink} ${styles.articleNavNext}`}
              rel="next"
            >
              <span className={styles.articleNavLabel}>
                {language.publicArticle.nextArticle} →
              </span>
              <span className={styles.articleNavTitle}>{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
