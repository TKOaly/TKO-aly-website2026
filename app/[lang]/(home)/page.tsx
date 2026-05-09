import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import { getAsyncTranslation } from "@/app/i18n"

import styles from "./page.module.css"

type CalendarEvent = {
  id: number
  name: string
  starts: string
  location: string
  deleted: boolean
}

async function getUpcomingEvents() {
  try {
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events`

    const response = await fetch(targetUrl, {
      next: { revalidate: 60 },
    })

    if (!response.ok) return []

    const events: CalendarEvent[] = await response.json()
    const now = new Date()

    return events
      .filter(e => !e.deleted && e.starts && new Date(e.starts) >= now)
      .sort(
        (a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime(),
      )
      .slice(0, 3)
  } catch (error) {
    console.error("Failed to fetch events", error)
    return []
  }
}

function formatEventDate(dateString: string) {
  const d = new Date(dateString)
  const weekdays = ["su", "ma", "ti", "ke", "to", "pe", "la"]
  const dayName = weekdays[d.getDay()]
  const day = d.getDate().toString().padStart(2, "0")
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")

  return `${dayName} ${day}.${month}. // klo ${hours}.${minutes}`
}

const HomePage = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  const events = await getUpcomingEvents()

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Link href="/gurula" className={styles.locationBadge}>
            <MapPin size={12} strokeWidth={3} /> Gurula DK115
          </Link>
          <h1 className={styles.heroTitle}>{t("home.heroTitle")}</h1>
          <p className={styles.heroDesc}>{t("home.heroDesc")}</p>
          <div>
            <button className={styles.joinButton}>
              {t("home.joinButton")}
            </button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <Image
            className={styles.heroImage}
            alt="Students collaborating"
            src="/splash.jpg"
            width={500}
            height={500}
            loading="eager"
          />
          <div className={styles.imageOverlay}>&gt;_ TKO-äly.webp</div>
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className={styles.eventsHeader}>
          <h2>{t("home.eventsTitle")}</h2>
          <Link className={styles.viewAll} href="/kalenteri">
            {t("home.allEvents")}
          </Link>
        </div>
        <div className={styles.eventsGrid}>
          {events.length > 0 ? (
            events.map((event, index) => {
              const isWide = index === 2
              return (
                <div
                  key={event.id}
                  className={`${styles.eventCard} ${isWide ? styles.eventCardWide : ""}`}
                >
                  <div className={isWide ? styles.eventInfo : ""}>
                    <div>
                      <div className={styles.eventDate}>
                        {formatEventDate(event.starts)}
                      </div>
                      <h3 className={styles.eventTitle}>{event.name}</h3>
                      <p className={styles.eventLocation}>
                        {event.location ? `@ ${event.location}` : ""}
                      </p>
                    </div>
                    <div className={isWide ? "" : styles.eventActions}>
                      <Link href={`/calendar_events/view/${event.id}`}>
                        <button className={styles.eventButton}>
                          {t("home.register")}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p>{t("home.noEvents")}</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default HomePage
