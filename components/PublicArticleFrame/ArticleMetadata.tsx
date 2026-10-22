export type ArticleFrontmatter = {
  title?: string
  date?: string
  readingTime?: number | string
  tag?: string
}

/**
 * Receives the page's YAML front-matter (injected by
 * lib/remark-article-metadata.mjs) and exposes it to PublicArticleFrame
 * through data attributes.
 */
export default function ArticleMetadata({
  tag,
  date,
  readingTime,
}: ArticleFrontmatter) {
  return (
    <span
      hidden
      data-article-metadata
      data-article-tag={tag}
      data-article-date={date}
      data-article-read-time={readingTime}
    />
  )
}
