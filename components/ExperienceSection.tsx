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

    return () => {
      observer.disconnect()
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
      <div className={styles.experienceLayout}>
        {/* First col - 25% empty via CSS grid */}

        {/* Second col - 25% sticky text */}
        <div className={styles.experienceSidebarWrapper}>
          <div className={styles.experienceHeader}>
            <h2>{t.title}</h2>
            <p>{t.desc}</p>
          </div>
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
