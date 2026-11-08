import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"

export type Lang = "fi" | "en"

const contentDir = join(process.cwd(), "content")
const extensions = ["md", "mdx"] as const
const slugPattern = /^[A-Za-z0-9-]+$/

export interface Article {
  slug: string
  /** Language of the file that was found; differs from the request when it falls back to Finnish. */
  lang: Lang
  /** "" for Finnish (page.md), ".en" for English (page.en.md). */
  suffix: string
  ext: (typeof extensions)[number]
  /** Repository-relative path, used for the edit link. */
  file: string
}

/** page.md is Finnish, page.en.md English; a missing translation falls back to Finnish. */
export function findArticle(slug: string, lang: Lang): Article | null {
  if (!slugPattern.test(slug)) return null

  for (const candidate of lang === "fi"
    ? (["fi"] as const)
    : (["en", "fi"] as const)) {
    const suffix = candidate === "fi" ? "" : `.${candidate}`
    for (const ext of extensions) {
      const file = `content/${slug}/page${suffix}.${ext}`
      if (existsSync(join(contentDir, slug, `page${suffix}.${ext}`))) {
        return { slug, lang: candidate, suffix, ext, file }
      }
    }
  }
  return null
}

export const isArticleHref = (href: string) =>
  href.startsWith("/") && findArticle(href.slice(1), "fi") !== null

export const articleSlugs = () =>
  readdirSync(contentDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
