"use client"

import { useQuery } from "@tanstack/react-query"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid" // a plugin!
import listPlugin from "@fullcalendar/list"
import fiLocale from "@fullcalendar/core/locales/fi"
import Link from "next/link"
import styles from "./Kalenteri.module.css"
import { useState, ReactNode, useMemo } from "react"
import type { Event, ProcessedEvent } from "./types"
import { useTranslation } from "react-i18next"

function EventCalendarView({ events }: { events: ProcessedEvent[] }) {
  const calendarEvents = events.map(event => ({
    id: String(event.id),
    title: event.name || "Untitled Event",
    start: event.starts,
    url: `/kalenteri/${event.id}`,
    backgroundColor: event.backgroundColor,
  }))

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      locale={fiLocale}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,listWeek",
      }}
      initialView="dayGridMonth"
      editable={false}
      selectable={true}
      eventDisplay="list-item"
      contentHeight={"60%"}
      events={calendarEvents}
    />
  )
}

export function EventListView({
  events,
  t,
}: {
  events: ProcessedEvent[]
  t: (key: string) => string
}) {
  return (
    <div id={styles.eventsList}>
      {events.map(event => (
        <Link key={event.id} href={`/kalenteri/${event.id}`}>
          <div
            className={styles.eventListItem}
            style={{ borderLeft: `4px solid ${event.backgroundColor}` }}
          >
            <h3>{event.name}</h3>
            <p>
              <strong>{t("event.starts")}:</strong>{" "}
              {new Date(event.starts).toLocaleDateString("fi-FI")},
              {new Date(event.starts).toLocaleTimeString("fi-FI", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>{t("event.starts")}:</strong> {event.location}
            </p>
            {event.organizer && (
              <p>
                <strong>{t("event.organizer")}:</strong> {event.organizer}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

function Legend({ t }: { t: (key: string) => string }) {
  const [isLegendVisible, setIsLegendVisible] = useState(false)

  const toggleLegendVisibility = () => {
    setIsLegendVisible(prev => !prev)
  }

  return (
    <div id={styles.calendarInstructions}>
      {isLegendVisible && (
        <div id={styles.legend}>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#0066ff" }}
            ></span>{" "}
            {t("event.legend.canNotRegistration")}
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#ffff00" }}
            ></span>{" "}
            {t("event.legend.registrationNotOpen")}
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#00ff00" }}
            ></span>{" "}
            {t("event.legend.registrationOpen")}
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#ff0000" }}
            ></span>{" "}
            {t("event.legend.registrationClosed")}
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#6e6e6eff" }}
            ></span>{" "}
            {t("event.legend.passedEvent")}
          </p>
        </div>
      )}
      <button onClick={toggleLegendVisibility} title="Kalenterin selite">
        {isLegendVisible ? t("event.legend.show") : t("event.legend.hide")}
      </button>
    </div>
  )
}

function hasValidStartTime(event: Event): event is Event & { starts: string } {
  return event.starts !== undefined
}

export function processEvents(eventsData: Event[]): ProcessedEvent[] {
  const now = new Date()

  return eventsData.filter(hasValidStartTime).map(event => {
    const registrationStarts = event.registration_starts
      ? new Date(event.registration_starts)
      : null
    const registrationEnds = event.registration_ends
      ? new Date(event.registration_ends)
      : null
    const start = new Date(event.starts)
    let backgroundColor: string

    if (!registrationStarts || !registrationEnds) {
      backgroundColor = now < start ? "#0066ff" : "#6e6e6e"
    } else if (now >= registrationStarts && now <= registrationEnds) {
      backgroundColor = "#00ff00"
    } else if (now < registrationStarts) {
      backgroundColor = "#ffff00"
    } else if (now > start) {
      backgroundColor = "#6e6e6e"
    } else {
      backgroundColor = "#ff0000"
    }

    return { ...event, backgroundColor }
  })
}

export default function Calendar() {
  const { t } = useTranslation()
  const now = new Date()
  const fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const {
    data: eventsList = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["eventList"],
    queryFn: (): Promise<Event[]> =>
      fetch(`/api/events/list?fromDate=${fromDate.toISOString()}`).then(r =>
        r.json(),
      ),
  })

  const processedEvents: ProcessedEvent[] = useMemo(() => {
    if (error || !eventsList) {
      return []
    }

    return processEvents(eventsList as Event[])
  }, [eventsList, error])

  let viewContent: ReactNode

  if (isLoading) {
    viewContent = <p>{t("event.loading")}</p>
  } else if (error) {
    viewContent = (
      <p>
        {t("event.error")}: {error.message}
      </p>
    )
  } else {
    viewContent = (
      <div id={styles.calenderPageContainer}>
        <div id={styles.eventsListContainer}>
          <EventListView events={processedEvents} t={t} />
        </div>
        <div style={{ marginLeft: "48px", width: "95%" }}>
          <EventCalendarView events={processedEvents} />
          <Legend t={t} />
        </div>
      </div>
    )
  }

  return (
    <div id={styles.calendarColor}>
      <div id={styles.calendar}>
        <div id={styles.calendarTitle}>
          <h1>{t("event.calender")}</h1>
        </div>
        {viewContent}
      </div>
    </div>
  )
}
