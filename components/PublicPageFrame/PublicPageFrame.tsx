"use client"

import { ExternalLink, FolderOpen, ListTree, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import en from "@/locales/en.json"
import fi from "@/locales/fi.json"

import Card from "@/components/Cards/Card"
import Terminal from "@/components/Cards/Terminal"
import TableOfContents from "@/components/TableOfContents/TableOfContents"

import { PageActionsContext } from "./PageActionsContext"
import styles from "./PublicPageFrame.module.css"

const GITHUB_BLOB_BASE =
  "https://github.com/TKOaly/TKO-aly-website2026/blob/main"

export type PageLink = { href: string; title: string }

export default function PublicPageFrame({
  children,
  pages = [],
  sourceFile,
  translationMissing = false,
}: {
  children: ReactNode
  pages?: PageLink[]
  sourceFile: string
  translationMissing?: boolean
}) {
  const pathname = usePathname()
  const frameRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const tocDrawerRef = useRef<HTMLDialogElement>(null)
  const pageEndRef = useRef<HTMLDivElement>(null)
  const [atPageEnd, setAtPageEnd] = useState(false)

  // Mobile: hide the floating contents button once the end-of-page
  // actions come into view (and while scrolled past them, e.g. the footer).
  useEffect(() => {
    const end = pageEndRef.current
    if (!end) return
    const observer = new IntersectionObserver(([entry]) => {
      setAtPageEnd(entry.isIntersecting || entry.boundingClientRect.top < 0)
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
    const frameEl = frameRef.current
    const sidebar = sidebarRef.current
    if (!frameEl || !sidebar) return

    const update = () => {
      // Measure the (non-sticky) grid parent: the sidebar itself is sticky, so
      // its own position shifts with scroll and would skew the offset.
      const anchor = sidebar.parentElement ?? sidebar
      const top = anchor.getBoundingClientRect().top + window.scrollY
      sidebar.style.setProperty("--sidebar-offset", `${Math.round(top)}px`)
    }
    update()

    const observer = new ResizeObserver(update)
    observer.observe(frameEl)
    return () => observer.disconnect()
  }, [])
  const pagePath = pathname.replace(/^\/(fi|en)/, "") || "/"
  const pageName = pagePath.split("/").filter(Boolean).pop() || "index"
  const editUrl = `${GITHUB_BLOB_BASE}/${sourceFile}`
  const lang = pathname.startsWith("/en") ? "en" : "fi"
  const language = lang === "en" ? en : fi
  const currentIndex = pages.findIndex(a => a.href === pagePath)
  const previous = currentIndex > 0 ? pages[currentIndex - 1] : undefined
  const next =
    currentIndex >= 0 && currentIndex < pages.length - 1
      ? pages[currentIndex + 1]
      : undefined
  return (
    <PageActionsContext.Provider value={{ editUrl }}>
      <div ref={frameRef} className={styles.frame}>
        <Card className={styles.metadataCard}>
          <div className={styles.metadata} aria-label="Page metadata">
            <span className={styles.path}>
              <FolderOpen size={16} aria-hidden /> ~/public/toiminta/
              {pageName}
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
                <a href={editUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden />{" "}
                  {language.publicPage.editOnGitHub}
                </a>
              </div>
            </Card>
          </aside>

          <main id="main-content" className={styles.page}>
            <Terminal
              className={styles.pageTerminal}
              barTitle={`${pageName}.md`}
              heading=""
              mobileCollapsible={false}
            >
              {translationMissing && (
                <p className={styles.notice} role="note">
                  {language.publicPage.translationMissing}
                </p>
              )}
              {children}

              {/* Mobile: full-width edit link at the end of the page. */}
              <div ref={pageEndRef} className={styles.mobileActions}>
                <a href={editUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={18} aria-hidden />{" "}
                  {language.publicPage.editOnGitHub}
                </a>
              </div>
            </Terminal>
          </main>
        </div>

        {(previous || next) && (
          <nav
            className={styles.pageNav}
            aria-label={language.publicPage.otherPages}
          >
            {previous && (
              <Link
                href={`/${lang}${previous.href}`}
                className={styles.pageNavLink}
                rel="prev"
              >
                <span className={styles.pageNavLabel}>
                  ← {language.publicPage.previousPage}
                </span>
                <span className={styles.pageNavTitle}>{previous.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={`/${lang}${next.href}`}
                className={`${styles.pageNavLink} ${styles.pageNavNext}`}
                rel="next"
              >
                <span className={styles.pageNavLabel}>
                  {language.publicPage.nextPage} →
                </span>
                <span className={styles.pageNavTitle}>{next.title}</span>
              </Link>
            )}
          </nav>
        )}

        {/* Mobile: floating table-of-contents button that opens a drawer. */}
        <button
          type="button"
          className={`btn ${styles.tocFab} ${atPageEnd ? styles.tocFabHidden : ""}`}
          onClick={openToc}
          aria-haspopup="dialog"
          hidden={!hasHeadings}
        >
          <ListTree size={18} aria-hidden />{" "}
          {language.publicPage.tableOfContents}
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
            <h2 id="toc-drawer-title">{language.publicPage.tableOfContents}</h2>
            <button
              type="button"
              className={styles.tocDrawerClose}
              onClick={closeToc}
              aria-label={language.publicPage.close}
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <div className={styles.tocDrawerBody}>
            <TableOfContents inDrawer />
          </div>
        </dialog>
      </div>
    </PageActionsContext.Provider>
  )
}
