"use client"

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  FolderOpen,
  Share2,
} from "lucide-react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import en from "@/locales/en.json"
import fi from "@/locales/fi.json"

import Card from "@/components/Cards/Card"
import Terminal from "@/components/Cards/Terminal"
import TableOfContents from "@/components/TableOfContents/TableOfContents"

import styles from "./PublicArticleFrame.module.css"

type ArticleMetadataValues = { tag: string; date: string; readTime: string }

const EMPTY_METADATA = JSON.stringify({ tag: "", date: "", readTime: "" })

const subscribeNever = () => () => {}

function readMetadata() {
  const marker = document.querySelector<HTMLElement>("[data-article-metadata]")
  return JSON.stringify({
    tag: marker?.dataset.articleTag || "",
    date: marker?.dataset.articleDate || "",
    readTime: marker?.dataset.articleReadTime || "",
  })
}

export default function PublicArticleFrame({
  children,
}: {
  children: ReactNode
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
      const top = sidebar.getBoundingClientRect().top + window.scrollY
      sidebar.style.setProperty("--sidebar-offset", `${Math.round(top)}px`)
    }
    update()

    const observer = new ResizeObserver(update)
    observer.observe(page)
    return () => observer.disconnect()
  }, [])
  const articlePath = pathname.replace(/^\/(fi|en)/, "") || "/"
  const articleName = articlePath.split("/").filter(Boolean).pop() || "index"
  const language = pathname.startsWith("/en") ? en : fi
  // The page's front-matter is exposed by <ArticleMetadata /> as a hidden
  // DOM marker; re-read it on every render so route changes pick it up.
  const metadata = JSON.parse(
    useSyncExternalStore(subscribeNever, readMetadata, () => EMPTY_METADATA),
  ) as ArticleMetadataValues

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
          {metadata.date && (
            <span>
              <CalendarDays size={16} aria-hidden />{" "}
              {language.publicArticle.added} {metadata.date}
            </span>
          )}
          {metadata.readTime && (
            <span>
              <Clock3 size={16} aria-hidden /> {metadata.readTime}{" "}
              {language.publicArticle.minRead}
            </span>
          )}
          {metadata.tag && (
            <span className={styles.status}>{metadata.tag}</span>
          )}
        </div>
      </Card>

      <div className={styles.contentGrid}>
        <aside ref={sidebarRef} className={styles.sidebar}>
          <Terminal
            className={styles.tocTerminal}
            barTitle="Table of Contents"
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
    </div>
  )
}
