"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid" // a plugin!
import listPlugin from "@fullcalendar/list"
import fiLocale from "@fullcalendar/core/locales/fi"
import styles from "./Kalenteri.module.css"
import { useEffect, useState, ReactNode } from "react"

type Event = {
  id: number
  user_id: number | null
  name: string | null
  created: string | null
  starts: string | null
  registration_starts: string | null
  registration_ends: string | null
  cancellation_starts: string | null
  cancellation_ends: string | null
  location: string | null
  category: string | null
  description: string | null
  alcohol_meter: number | null
  price: string | null
  map: string | null
  max_participants: number | null
  realised_participants: number | null
  membership_required: boolean | null
  outsiders_allowed: boolean | null
  template: boolean | null
  responsible: string | null
  show_responsible: boolean | null
  avec: boolean | null
  deleted: boolean | null
}

type ProcessedEvent = Event & {
  starts: string
  backgroundColor: string
}

function EventCalendarView({ events }: { events: ProcessedEvent[] }) {
  const calendarEvents = events.map(event => ({
    id: String(event.id),
    title: event.name || "Untitled Event",
    start: event.starts,
    url: `/calendar_events/view/${event.id}`,
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

function EventListView({ events }: { events: ProcessedEvent[] }) {
  return (
    <div id={styles["events-list"]}>
      {events.map(event => (
        <a key={event.id} href={`/calendar_events/view/${event.id}`}>
          <div
            className={styles["event-list-item"]}
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
            <p>{event.description}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLegendVisible, setIsLegendVisible] = useState(false)
  const [isListView, setIsListView] = useState(false)

  const toggleLegendVisibility = () => {
    setIsLegendVisible(prev => !prev)
  }

  useEffect(() => {
    let isActive = true

    fetch("/api/events", {
      headers: {
        Accept: "application/json",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch events: ${response.status} ${response.statusText}`,
          )
        }
        return response.json()
      })
      .then(data => {
        if (!isActive) {
          return
        }

        setEvents(data as Event[])
      })
      .catch(error => {
        if (!isActive) {
          return
        }

        setLoadError(
          error instanceof Error ? error.message : "Failed to load events",
        )
      })

    return () => {
      isActive = false
    }
  }, [])

  const processedEvents: ProcessedEvent[] = processEvents(events)

  function hasValidStartTime(
    event: Event,
  ): event is Event & { starts: string } {
    return event.starts !== null
  }

  function processEvents(eventsData: Event[]): ProcessedEvent[] {
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

  let viewContent: ReactNode

  if (loadError) {
    viewContent = <p>{loadError}</p>
  } else if (isListView) {
    viewContent = <EventListView events={processedEvents} />
  } else {
    viewContent = <EventCalendarView events={processedEvents} />
  }

  return (
    <div id={styles.calendar}>
      <div id={styles["calendar-title"]}>
        <h1>Tapahtumakalenteri</h1>
      </div>
      <div id={styles["calendar-control-bar"]}>
        <div id={styles["calendar-view-toggle"]}>
          <button
            id={styles["show-calendar-button"]}
            className={`${styles["view-toggle-button"]} ${!isListView ? styles["view-toggle-active"] : ""}`}
            title="Kalenterinäkymä"
            aria-label="Näytä kalenterinäkymä"
            onClick={() => setIsListView(false)}
          >
            Kalenteri
          </button>
          <button
            id={styles["show-list-button"]}
            className={`${styles["view-toggle-button"]} ${isListView ? styles["view-toggle-active"] : ""}`}
            title="Listanäkymä"
            aria-label="Näytä listanäkymä"
            onClick={() => setIsListView(true)}
          >
            Lista
          </button>
        </div>
      </div>
      {viewContent}
      <div id={styles["calendar-instructions"]}>
        {isLegendVisible && (
          <div id={styles.legend}>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#0066ff" }}
              ></span>{" "}
              Tapahtumaan ei ilmoittautumista
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#ffff00" }}
              ></span>{" "}
              Ilmoittautuminen ei ole alkanut
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#00ff00" }}
              ></span>{" "}
              Ilmoittautuminen on auki
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#ff0000" }}
              ></span>{" "}
              Ilmoittautuminen on päättynyt
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
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
    </div>
  )
}
