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
  // Accordions start open; clicking toggles them.
  const [manual, setManual] = useState<Record<string, boolean>>({})
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
  // container directly (scrollIntoView would also scroll the page), and wait
  // until the active link has settled so fast page scrolling doesn't make the
  // ToC jump around.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const link = navRef.current?.querySelector<HTMLElement>(
        `.${styles.active}`,
      )
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
      let delta = 0
      if (linkRect.top < containerRect.top) {
        delta = linkRect.top - containerRect.top
      } else if (linkRect.bottom > containerRect.bottom) {
        delta = linkRect.bottom - containerRect.bottom
      }
      if (delta === 0) return

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      container.scrollTo({
        top: container.scrollTop + delta,
        behavior: reduceMotion ? "auto" : "smooth",
      })
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [activeId])

  const renderLink = (item: TocItem) => (
    <a
      href={`#${item.id}`}
      title={item.text}
      className={`${styles.tocLink} ${activeId === item.id ? styles.active : ""}`}
    >
      <span className={styles.tocText}>{item.text}</span>
    </a>
  )

  const renderItem = (item: TocItem) => {
    if (item.children.length === 0) {
      return (
        <li key={item.id} className={styles.tocItemParent}>
          {renderLink(item)}
        </li>
      )
    }

    const open = manual[item.id] ?? true
    const panelId = `toc-${item.id}`
    return (
      <li key={item.id} className={styles.tocItemParent}>
        <button
          type="button"
          className={`${styles.tocLink} ${styles.tocToggle}`}
          aria-expanded={open}
          aria-controls={panelId}
          title={item.text}
          onClick={() =>
            setManual(current => ({ ...current, [item.id]: !open }))
          }
        >
          <span aria-hidden className={styles.chevron}>
            {open ? "−" : "+"}
          </span>
          <span className={styles.tocText}>{item.text}</span>
        </button>
        <ul id={panelId} className={styles.tocListNested} hidden={!open}>
          {item.children.map(child => (
            <li key={child.id} className={styles.tocItemChild}>
              {renderLink(child)}
            </li>
          ))}
        </ul>
      </li>
    )
  }

  const renderTree = (nodes: TocItem[]) =>
    nodes.map(node =>
      node.level === 1 ? (
        <li key={node.id} className={styles.tocItemParent}>
          <p className={styles.tocTitle} title={node.text}>
            {node.text}
          </p>
          {node.children.length > 0 && (
            <ul className={styles.tocListNested}>
              {node.children.map(renderItem)}
            </ul>
          )}
        </li>
      ) : (
        renderItem(node)
      ),
    )

  return (
    <aside className={styles.toc} aria-hidden={items.length === 0}>
      {items.length > 0 && (
        <nav ref={navRef} aria-label="table of contents">
          <ul className={styles.tocList}>{renderTree(items)}</ul>
        </nav>
      )}
    </aside>
  )
}
