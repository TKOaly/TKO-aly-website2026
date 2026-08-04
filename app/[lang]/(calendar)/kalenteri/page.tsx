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

export function EventListView({ events }: { events: ProcessedEvent[] }) {
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
              <strong>Alkaa:</strong>{" "}
              {new Date(event.starts).toLocaleDateString("fi-FI")},
              {new Date(event.starts).toLocaleTimeString("fi-FI", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Sijainti:</strong> {event.location}
            </p>
            {event.organizer && (
              <p>
                <strong>Järjestävä taho:</strong> {event.organizer}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

export function Legend() {
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
            Tapahtumaan ei ilmoittautumista
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#ffff00" }}
            ></span>{" "}
            Ilmoittautuminen ei ole alkanut
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#00ff00" }}
            ></span>{" "}
            Ilmoittautuminen on auki
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#ff0000" }}
            ></span>{" "}
            Ilmoittautuminen on päättynyt
          </p>
          <p>
            <span
              className={styles.legendColorBall}
              style={{ backgroundColor: "#6e6e6eff" }}
            ></span>{" "}
            Tapahtuma on mennyt
          </p>
        </div>
      )}
      <button onClick={toggleLegendVisibility} title="Kalenterin selite">
        {isLegendVisible ? "Piilota selite" : "Näytä selite"}
      </button>
    </div>
  )
}

function hasValidStartTime(event: Event): event is Event & { starts: string } {
  return event.starts !== null
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
  const {
    data: eventsList = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events"],
    queryFn: (): Promise<Event[]> => fetch("/api/events").then(r => r.json()),
  })

  const processedEvents: ProcessedEvent[] = useMemo(() => {
    return processEvents(eventsList as Event[])
  }, [eventsList])

  let viewContent: ReactNode

  if (isLoading) {
    viewContent = <p>Ladataan tapahtumia...</p>
  } else if (error) {
    viewContent = <p>Virhe: {error.message}</p>
  } else {
    viewContent = (
      <div id={styles.calenderPageContainer}>
        <EventListView events={processedEvents} />
        <div style={{marginLeft: "48px", width: "95%"}}>
          <EventCalendarView events={processedEvents} />
          <Legend />
        </div>
      </div>
    )
  }

  return (
    <div id={styles.calendar}>
      <div id={styles.calendarTitle}>
        <h1>Tapahtumakalenteri</h1>
      </div>
      {viewContent}
    </div>
  )
}
