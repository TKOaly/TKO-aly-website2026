import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: ({ children, ...props }) => {
      // Basic slug generator since rehype-slug causes serialization issues in Turbopack Next.js configs
      const slug = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      return (
        <h2 id={slug} {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const slug = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      return (
        <h3 id={slug} {...props}>
          {children}
        </h3>
      )
    },
  }
}
