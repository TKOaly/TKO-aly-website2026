"use client"

import { ExternalLink, FolderOpen, ListTree, Share2, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import en from "@/locales/en.json"
import fi from "@/locales/fi.json"

import Card from "@/components/Cards/Card"
import Terminal from "@/components/Cards/Terminal"
import TableOfContents from "@/components/TableOfContents/TableOfContents"

import { ArticleActionsContext } from "./ArticleActionsContext"
import styles from "./PublicArticleFrame.module.css"

const GITHUB_BLOB_BASE =
  "https://github.com/TKOaly/TKO-aly-website2026/blob/main"

export type ArticleLink = { href: string; title: string }

export default function PublicArticleFrame({
  children,
  articles = [],
  sourceFile,
  translationMissing = false,
}: {
  children: ReactNode
  articles?: ArticleLink[]
  sourceFile: string
  translationMissing?: boolean
}) {
  const pathname = usePathname()
  const [shared, setShared] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const tocDrawerRef = useRef<HTMLDialogElement>(null)
  const articleEndRef = useRef<HTMLDivElement>(null)
  const [atArticleEnd, setAtArticleEnd] = useState(false)

  // Mobile: hide the floating contents button once the end-of-article
  // actions come into view (and while scrolled past them, e.g. the footer).
  useEffect(() => {
    const end = articleEndRef.current
    if (!end) return
    const observer = new IntersectionObserver(([entry]) => {
      setAtArticleEnd(entry.isIntersecting || entry.boundingClientRect.top < 0)
    })
    observer.observe(end)
    return () => observer.disconnect()
  }, [])
  const [hasHeadings, setHasHeadings] = useState(false)

  // Mobile: only offer the table-of-contents button when there is something
  // to jump to. Deferred a frame so the MDX headings are in the DOM.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const main = document.getElementById("main-content")
      setHasHeadings(Boolean(main?.querySelector("h2[id], h3[id]")))
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  // Lock page scroll while the drawer is open; onClose restores it.
  const openToc = () => {
    document.documentElement.style.overflow = "hidden"
    tocDrawerRef.current?.showModal()
  }
  const closeToc = () => tocDrawerRef.current?.close()

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
  const editUrl = `${GITHUB_BLOB_BASE}/${sourceFile}`
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
    <ArticleActionsContext.Provider value={{ share, shared, editUrl }}>
      <div ref={pageRef} className={styles.page}>
        <Card className={styles.metadataCard}>
          <div className={styles.metadata} aria-label="Article metadata">
            <span className={styles.path}>
              <FolderOpen size={16} aria-hidden /> ~/public/toiminta/
              {articleName}
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
                <a href={editUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden />{" "}
                  {language.publicArticle.editOnGitHub}
                </a>
              </div>
            </Card>
          </aside>

          <main id="main-content" className={styles.article}>
            <Terminal
              className={styles.articleTerminal}
              barTitle={`${articleName}.md`}
              heading=""
              mobileCollapsible={false}
            >
              {translationMissing && (
                <p className={styles.notice} role="note">
                  {language.publicArticle.translationMissing}
                </p>
              )}
              {children}

              {/* Mobile: full-width actions at the end of the article. */}
              <div ref={articleEndRef} className={styles.mobileActions}>
                <button
                  type="button"
                  className={styles.mobileActionPrimary}
                  onClick={share}
                >
                  <Share2 size={18} aria-hidden />{" "}
                  {shared
                    ? language.publicArticle.linkCopied
                    : language.publicArticle.shareArticle}
                </button>
                <a href={editUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={18} aria-hidden />{" "}
                  {language.publicArticle.editOnGitHub}
                </a>
              </div>
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

        {/* Mobile: floating table-of-contents button that opens a drawer. */}
        <button
          type="button"
          className={`btn ${styles.tocFab} ${atArticleEnd ? styles.tocFabHidden : ""}`}
          onClick={openToc}
          aria-haspopup="dialog"
          hidden={!hasHeadings}
        >
          <ListTree size={18} aria-hidden />{" "}
          {language.publicArticle.tableOfContents}
        </button>

        <dialog
          ref={tocDrawerRef}
          className={styles.tocDrawer}
          aria-labelledby="toc-drawer-title"
          onClose={() => {
            document.documentElement.style.overflow = ""
          }}
          onClick={event => {
            // Close on a backdrop tap, or after picking a section.
            const target = event.target as HTMLElement
            if (target === event.currentTarget || target.closest("a"))
              closeToc()
          }}
        >
          <div className={styles.tocDrawerHeader}>
            <h2 id="toc-drawer-title">
              {language.publicArticle.tableOfContents}
            </h2>
            <button
              type="button"
              className={styles.tocDrawerClose}
              onClick={closeToc}
              aria-label={language.publicArticle.close}
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <div className={styles.tocDrawerBody}>
            <TableOfContents inDrawer />
          </div>
        </dialog>
      </div>
    </ArticleActionsContext.Provider>
  )
}
