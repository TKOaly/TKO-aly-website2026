"use client"

import { useLayoutEffect, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import styles from "./TableOfContents.module.css"

type TocItem = {
  id: string
  text: string
  level: number
  children: TocItem[]
}

function collectHeadings(): TocItem[] {
  const mainContent = document.getElementById("main-content")
  if (!mainContent) return []

  const headingElements = mainContent.querySelectorAll("h1, h2, h3")
  const tocItems: TocItem[] = []

  headingElements.forEach(heading => {
    const level = parseInt(heading.tagName.replace("H", ""), 10)
    const text = heading.textContent || ""
    const id = heading.id
    if (!id || !text) return

    const item: TocItem = { id, text, level, children: [] }

    if (level === 1) {
      tocItems.push(item)
      return
    }

    const lastRoot = tocItems[tocItems.length - 1]

    if (level === 2) {
      if (lastRoot && lastRoot.level === 1) {
        lastRoot.children.push(item)
      } else {
        tocItems.push(item)
      }
      return
    }

    if (level === 3) {
      if (lastRoot?.level === 1 && lastRoot.children.length > 0) {
        lastRoot.children[lastRoot.children.length - 1].children.push(item)
      } else if (lastRoot && lastRoot.level === 2) {
        lastRoot.children.push(item)
      } else if (lastRoot) {
        lastRoot.children.push(item)
      } else {
        tocItems.push(item)
      }
    }
  })

  return tocItems
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      setItems(collectHeadings())
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  useEffect(() => {
    if (items.length === 0) return

    const mainContent = document.getElementById("main-content")
    if (!mainContent) return

    const headings = Array.from(mainContent.querySelectorAll("h1, h2, h3"))

    const handleScroll = () => {
      let currentActiveId = ""

      for (const heading of headings) {
        const top = heading.getBoundingClientRect().top
        if (top >= 0 && top < window.innerHeight * 0.4) {
          currentActiveId = heading.id
          break
        } else if (top < 0) {
          currentActiveId = heading.id
        }
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId)
      }
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [items, activeId])

  // Keep the active link visible when the ToC itself is scrollable. Scroll the
  // container directly: scrollIntoView would also scroll the page.
  useEffect(() => {
    const link = navRef.current?.querySelector<HTMLElement>(`.${styles.active}`)
    if (!link) return

    let container: HTMLElement | null = link.parentElement
    while (
      container &&
      !/(auto|scroll)/.test(getComputedStyle(container).overflowY)
    ) {
      container = container.parentElement
    }
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    if (linkRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - linkRect.top
    } else if (linkRect.bottom > containerRect.bottom) {
      container.scrollTop += linkRect.bottom - containerRect.bottom
    }
  }, [activeId])

  const renderLinks = (nodes: TocItem[], nested = false) => (
    <ul className={nested ? styles.tocListNested : styles.tocList}>
      {nodes.map(item => (
        <li
          key={item.id}
          className={nested ? styles.tocItemChild : styles.tocItemParent}
        >
          <a
            href={`#${item.id}`}
            className={`${styles.tocLink} ${activeId === item.id ? styles.active : ""}`}
          >
            {item.text}
          </a>
          {item.children.length > 0 && renderLinks(item.children, true)}
        </li>
      ))}
    </ul>
  )

  return (
    <aside className={styles.toc} aria-hidden={items.length === 0}>
      {items.length > 0 && (
        <nav ref={navRef} aria-label="Table of Contents">
          {renderLinks(items)}
        </nav>
      )}
    </aside>
  )
}
