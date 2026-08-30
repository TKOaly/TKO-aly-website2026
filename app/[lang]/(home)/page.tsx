import Image from "next/image"
import { MapPin } from "lucide-react"

import { getAsyncTranslation, ServerLink } from "@/app/i18n"
import ExperienceSection from "@/components/Home/ExperienceSection"
import TikTokSection from "@/components/Home/TikTokSection"

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
    if (!process.env.EVENTS_API_BASE_URL) {
      console.warn("EVENTS_API_BASE_URL is not set, skipping events fetch")
      return []
    }

    const baseUrl = process.env.EVENTS_API_BASE_URL
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
          <h1 className={styles.heroTitle}>{t("home.heroTitle")}</h1>
          <p className={styles.heroSubtitle}>{t("home.heroSubtitle")}</p>
          <p className={styles.heroDesc}>{t("home.heroDesc")}</p>
          <div className={styles.heroActions}>
            <ServerLink lang={lang} href="/jaseneksi" className="btn btnCta">
              {t("home.joinButton")}
            </ServerLink>
            <ServerLink lang={lang} href="/kalenteri" className="btn">
              {t("home.eventsButton")}
            </ServerLink>
          </div>
          <ServerLink
            lang={lang}
            href="/yhteystiedot"
            className={styles.locationBadge}
          >
            <MapPin size={12} strokeWidth={3} /> Gurula DK115
          </ServerLink>
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
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.eventsSection}>
        <div className={styles.eventsHeader}>
          <h2>{t("home.eventsTitle")}</h2>
          <ServerLink lang={lang} className={styles.viewAll} href="/kalenteri">
            {t("home.allEvents")}
          </ServerLink>
        </div>
        <div className={styles.eventsGrid}>
          {events.length > 0
            ? events.map((event, index) => {
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
                        <ServerLink
                          lang={lang}
                          href={`/kalenteri/${event.id}`}
                          className="btn"
                        >
                          {t("home.register")}
                        </ServerLink>
                      </div>
                    </div>
                  </div>
                )
              })
            : [
                {
                  href: "/kalenteri",
                  title: t("home.fillerCalendarTitle"),
                  desc: t("home.fillerCalendarDesc"),
                },
                {
                  href: "/yhteystiedot",
                  title: t("home.fillerGurulaTitle"),
                  desc: t("home.fillerGurulaDesc"),
                },
              ].map(card => (
                <div key={card.href} className={styles.eventCard}>
                  <div>
                    <h3 className={styles.eventTitle}>{card.title}</h3>
                    <p className={styles.eventFillerDesc}>{card.desc}</p>
                  </div>
                  <div className={styles.eventActions}>
                    <ServerLink lang={lang} href={card.href} className="btn">
                      {t("common.readMore")}
                    </ServerLink>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* TikTok Social Media Section */}
      <TikTokSection />

      {/* Try TKO-äly Experience Section */}
      <ExperienceSection
        t={{
          title: t("home.experience"),
          desc: t("home.experienceDesc"),
          items: [
            {
              id: "association",
              title: t("home.expAssociation"),
              desc: t("home.expAssociationDesc"),
              image: "/Tekis_2017.jpg",
            },
            {
              id: "gurula",
              title: t("home.expGurula"),
              desc: t("home.expGurulaDesc"),
              image: "/Gurula_2024.jpg",
            },
            {
              id: "navetta",
              title: t("home.expNavetta"),
              desc: t("home.expNavettaDesc"),
              image: "/Navetta_2024.jpg",
            },
          ],
        }}
      />
    </main>
  )
}

export default HomePage
