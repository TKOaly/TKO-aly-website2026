"use client"

import { ExternalLink } from "lucide-react"
import { usePathname } from "next/navigation"

import en from "@/locales/en.json"
import fi from "@/locales/fi.json"

import { usePageActions } from "./PageActionsContext"
import styles from "./PageMetadata.module.css"

export type PageFrontmatter = {
  title?: string
  description?: string
  tags?: string[]
  coverImage?: string
  coverImageAlt?: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Receives the page's YAML front-matter (injected by
 * lib/remark-page-metadata.mjs) and renders the page header: title,
 * description, an inline row of tags, and
 * the cover image with its alt text as caption.
 */
export default function PageMetadata({
  title,
  description,
  tags,
  coverImage,
  coverImageAlt,
}: PageFrontmatter) {
  const language = usePathname().startsWith("/en") ? en : fi
  const labels = language.publicPage
  const allTags = tags ?? []
  const actions = usePageActions()
  const hasMeta = allTags.length > 0

  return (
    <header className={styles.header}>
      {title && <h1 id={slugify(title)}>{title}</h1>}
      {description && <p className={styles.description}>{description}</p>}

      {(hasMeta || actions) && (
        <div className={`${styles.meta} ${hasMeta ? "" : styles.actionsOnly}`}>
          {allTags.length > 0 && (
            <ul className={styles.tags} aria-label={labels.tags}>
              {allTags.map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {/* Mobile only: compact edit link next to the tags. */}
          {actions && (
            <span className={styles.quickActions}>
              <a
                href={actions.editUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={labels.editOnGitHub}
                title={labels.editOnGitHub}
              >
                <ExternalLink size={16} aria-hidden />
              </a>
            </span>
          )}
        </div>
      )}

      {coverImage && (
        <figure className={styles.cover}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt={coverImageAlt ?? ""} data-cover-image />
          {coverImageAlt && <figcaption>{coverImageAlt}</figcaption>}
        </figure>
      )}
    </header>
  )
}
