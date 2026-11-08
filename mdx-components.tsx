import type { ComponentPropsWithoutRef } from "react"
import type { MDXComponents } from "mdx/types"

import ArticleMetadata from "@/components/PublicArticleFrame/ArticleMetadata"

function slugify(children: unknown) {
  return children
    ?.toString()
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function heading(Tag: "h1" | "h2" | "h3") {
  function Heading({ children, ...props }: ComponentPropsWithoutRef<"h1">) {
    const slug = slugify(children)
    return (
      <Tag id={slug} {...props}>
        <a href={`#${slug}`}>{children}</a>
      </Tag>
    )
  }
  return Heading
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ArticleMetadata,
    h1: heading("h1"),
    h2: heading("h2"),
    h3: heading("h3"),
  }
}
