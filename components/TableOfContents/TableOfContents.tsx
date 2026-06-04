"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import styles from "./TableOfContents.module.css"

type TocItem = {
  id: string
  text: string
  level: number
  children: TocItem[]
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const pathname = usePathname()

  useEffect(() => {
    // A small delay ensures Next.js has finished painting the new page's DOM elements
    const timeoutId = setTimeout(() => {
      // Only query headings inside the main content area to avoid nav/footer headings
      const mainContent = document.getElementById("main-content")
      if (!mainContent) return

      const headingElements = mainContent.querySelectorAll("h2, h3")
      const tocItems: TocItem[] = []

      headingElements.forEach(heading => {
        const level = parseInt(heading.tagName.replace("H", ""))

        // Extract text content cleanly
        const text = heading.textContent || ""
        const id = heading.id

        if (!id || !text) return

        const item: TocItem = { id, text, level, children: [] }

        if (level === 2) {
          tocItems.push(item)
        } else if (level === 3) {
          // Find the last h2 and append this h3 as a child
          if (tocItems.length > 0) {
            tocItems[tocItems.length - 1].children.push(item)
          } else {
            // If there's an h3 without a preceding h2, add it at the top level
            tocItems.push(item)
          }
        }
      })

      setItems(tocItems)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  useEffect(() => {
    if (items.length === 0) return

    const mainContent = document.getElementById("main-content")
    if (!mainContent) return

    const headings = Array.from(mainContent.querySelectorAll("h2, h3"))

    const handleScroll = () => {
      let currentActiveId = ""

      // Calculate which heading is currently actively being read based on vertical scroll
      for (const heading of headings) {
        const top = heading.getBoundingClientRect().top
        // The active threshold: heading is near the top of the viewport
        if (top >= 0 && top < window.innerHeight * 0.4) {
          currentActiveId = heading.id
          break
        } else if (top < 0) {
          // Passed the top, so it is the active one unless the next one takes over
          currentActiveId = heading.id
        }
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId)
      }
    }

    // Trigger an initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [items, activeId])

  if (items.length === 0) {
    return null
  }

  return (
    <aside className={styles.toc}>
      <nav aria-label="Table of Contents">
        <ul className={styles.tocList}>
          {items.map(item => (
            <li key={item.id} className={styles.tocItemParent}>
              <a
                href={`#${item.id}`}
                className={`${styles.tocLink} ${activeId === item.id ? styles.active : ""}`}
              >
                {item.text}
              </a>
              {item.children.length > 0 && (
                <ul className={styles.tocListNested}>
                  {item.children.map(child => (
                    <li key={child.id} className={styles.tocItemChild}>
                      <a
                        href={`#${child.id}`}
                        className={`${styles.tocLink} ${activeId === child.id ? styles.active : ""}`}
                      >
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
