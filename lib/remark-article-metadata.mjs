/**
 * Renders <ArticleMetadata {...frontmatter} /> right after the front-matter
 * block, so pages only need a YAML header. Must run before remark-mdx-frontmatter.
 */
export default function remarkArticleMetadata() {
  return tree => {
    const index = tree.children.findIndex(node => node.type === "yaml")
    if (index === -1) return

    tree.children.splice(index + 1, 0, {
      type: "mdxJsxFlowElement",
      name: "ArticleMetadata",
      attributes: [
        {
          type: "mdxJsxExpressionAttribute",
          value: "...frontmatter",
          data: {
            estree: {
              type: "Program",
              sourceType: "module",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ObjectExpression",
                    properties: [
                      {
                        type: "SpreadElement",
                        argument: { type: "Identifier", name: "frontmatter" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      ],
      children: [],
    })
  }
}
