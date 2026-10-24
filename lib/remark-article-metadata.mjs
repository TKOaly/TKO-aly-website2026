const frontmatterField = name => ({
  type: "Property",
  kind: "init",
  method: false,
  shorthand: false,
  computed: false,
  key: { type: "Identifier", name },
  value: {
    type: "MemberExpression",
    computed: false,
    optional: false,
    object: { type: "Identifier", name: "frontmatter" },
    property: { type: "Identifier", name },
  },
})

/**
 * Turns a page's YAML front-matter into
 *  - `export const metadata`, so Next.js sets the tab title ("<title> | TKO-äly")
 *  - <ArticleMetadata {...frontmatter} />, rendered right after the header
 * Must run before remark-mdx-frontmatter, which defines `frontmatter`.
 */
export default function remarkArticleMetadata() {
  return tree => {
    const index = tree.children.findIndex(node => node.type === "yaml")
    if (index === -1) return

    const metadataExport = {
      type: "mdxjsEsm",
      value:
        "export const metadata = { title: frontmatter.title, description: frontmatter.description }",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "metadata" },
                    init: {
                      type: "ObjectExpression",
                      properties: [
                        frontmatterField("title"),
                        frontmatterField("description"),
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    }

    const articleMetadata = {
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
    }

    tree.children.splice(index + 1, 0, metadataExport, articleMetadata)
  }
}
