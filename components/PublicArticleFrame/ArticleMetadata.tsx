export type ArticleFrontmatter = {
  title?: string
  date?: string
  readingTime?: number | string
  tag?: string
  coverImage?: string
  coverImageAlt?: string
}

/**
 * Receives the page's YAML front-matter (injected by
 * lib/remark-article-metadata.mjs). Exposes the values PublicArticleFrame
 * needs through a hidden marker, and renders the optional cover image.
 */
export default function ArticleMetadata({
  tag,
  date,
  readingTime,
  coverImage,
  coverImageAlt,
}: ArticleFrontmatter) {
  return (
    <>
      <span
        hidden
        data-article-metadata
        data-article-tag={tag}
        data-article-date={date}
        data-article-read-time={readingTime}
      />
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt={coverImageAlt ?? ""} data-cover-image />
      )}
    </>
  )
}
