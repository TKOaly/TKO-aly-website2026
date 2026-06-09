"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import styles from "./ExperienceSection.module.css"

export type ExperienceTranslations = {
  title: string
  desc: string
  items: {
    id: string
    title: string
    desc: string
    image: string
  }[]
}

const ExperienceSection = ({ t }: { t: ExperienceTranslations }) => {
  const [activeItem, setActiveItem] = useState(t.items[0].id)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Find the entry that is mostly in view
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const id = entry.target.getAttribute("data-id")
            if (id) setActiveItem(id)
          }
        })
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      },
    )

    imageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    const handleScroll = () => {
      const centerY = window.innerHeight / 2
      const maxDist = window.innerHeight / 2

      imageRefs.current.forEach(ref => {
        if (!ref) return

        // Calculate based on the static outer container
        const rect = ref.getBoundingClientRect()
        const elementCenterY = rect.top + rect.height / 2
        const dist = Math.abs(centerY - elementCenterY)
        const ratio = Math.max(0, 1 - dist / maxDist)
        const opacity = 0.4 + 0.6 * ratio

        // Apply visual changes to the inner wrapper so we don't mess up bounding rects
        const wrapper = ref.firstElementChild as HTMLElement
        if (!wrapper) return

        wrapper.style.opacity = opacity.toString()

        let translateX = 0
        // Finish horizontal translation when the element reaches the bottom third of the screen
        const targetY = window.innerHeight * 0.66
        if (elementCenterY > targetY) {
          const bottomRatio = Math.min(
            1,
            (elementCenterY - targetY) / (window.innerHeight - targetY),
          )
          translateX = bottomRatio * 96
        }
        wrapper.style.transform = `translateX(${translateX}px)`
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const scrollToId = (id: string) => {
    const el = document.getElementById(`exp-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <section className={styles.experienceSection} id="experience">
      <div className={styles.experienceHeader}>
        <h2>{t.title}</h2>
        <p>{t.desc}</p>
      </div>
      <div className={styles.experienceLayout}>
        {/* First col - 25% empty via CSS grid */}

        {/* Second col - 25% sticky text */}
        <div className={styles.experienceSidebarWrapper}>
          <div className={styles.experienceSidebar}>
            {t.items.map(item => (
              <div
                key={item.id}
                className={`${styles.experienceItem} ${activeItem === item.id ? styles.active : ""}`}
                onClick={() => scrollToId(item.id)}
              >
                <h3>{item.title}</h3>
                <div className={styles.experienceItemDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Third col - 50% images */}
        <div className={styles.experienceImages}>
          {t.items.map((item, i) => (
            <div
              key={item.id}
              id={`exp-${item.id}`}
              data-id={item.id}
              className={styles.experienceImageBlock}
              ref={el => {
                imageRefs.current[i] = el
              }}
            >
              <div className={styles.experienceImageWrapper}>
                <Image
                  src={item.image}
                  alt={item.title}
                  draggable={false}
                  fill
                  className={styles.experienceImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
