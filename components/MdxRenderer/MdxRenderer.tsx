"use client"

import { Component, useMemo } from "react"
import type { ComponentType, ReactNode } from "react"
import type { MDXComponents } from "mdx/types"
import { evaluateSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import Link from "next/link"
import { isDevEnv } from "@/lib/featureFlags"

interface MdxRendererProps {
  source?: string | null
  className?: string
  trusted?: boolean
}

type MdxContent = ComponentType<{ components?: MDXComponents }>

const EXTERNAL = /^https?:\/\//i
const SAFE_NON_ROUTER = /^(mailto:|tel:)/i
const INTERNAL = /^(\/(?!\/)|\.{1,2}\/)/

const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    if (EXTERNAL.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    }

    if (SAFE_NON_ROUTER.test(href) || href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      )
    }

    if (INTERNAL.test(href)) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }

    return <span>{children}</span>
  },
}

const BLOCKED_NODES = new Set([
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxTextExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
])

interface TreeNode {
  type: string
  children?: TreeNode[]
}

function strip(node: TreeNode) {
  if (!Array.isArray(node.children)) return
  node.children = node.children.filter(child => !BLOCKED_NODES.has(child.type))
  node.children.forEach(strip)
}

function remarkStripMdxJs() {
  return (tree: TreeNode) => strip(tree)
}

interface BoundaryProps {
  fallback: ReactNode
  resetKey: string
  children: ReactNode
}

class RenderBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidUpdate(prev: BoundaryProps) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false })
    }
  }

  componentDidCatch(error: unknown) {
    console.error("MDX render failed:", error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function MdxRenderer({
  source,
  className,
  trusted = false,
}: MdxRendererProps) {
  const text = source?.trim() ? source : null

  const Content = useMemo<MdxContent | null>(() => {
    if (!text) return null

    try {
      const result = evaluateSync(text, {
        ...runtime,
        remarkPlugins: trusted ? [] : [remarkStripMdxJs],
      })
      return result.default as MdxContent
    } catch (error: unknown) {
      if (!isDevEnv) {
        console.error("MDX compile failed:", error)
      }
      return null
    }
  }, [text, trusted])

  if (!text) return null

  const fallback = <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{text}</p>

  return (
    <div
      className={className}
      style={{
        width: "100%",
        minWidth: 0,
        overflowWrap: "anywhere",
        lineHeight: 1.7,
      }}
    >
      {Content ? (
        <RenderBoundary fallback={fallback} resetKey={text}>
          <Content components={components} />
        </RenderBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
