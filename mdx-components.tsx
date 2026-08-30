import type { MDXComponents } from "mdx/types"

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children, ...props }) => {
      const slug = slugify(children)
      return (
        <h1 id={slug} {...props}>
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }) => {
      const slug = slugify(children)
      return (
        <h2 id={slug} {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const slug = slugify(children)
      return (
        <h3 id={slug} {...props}>
          {children}
        </h3>
      )
    },
  }
}
