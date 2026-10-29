import type { NextConfig } from "next"
import createMDX from "@next/mdx"
import path from "node:path"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["beta.tko-aly.localhost"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["accept-language"],
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      path.resolve("lib/remark-article-metadata.mjs"),
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
