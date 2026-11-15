"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import fiLocale from "@fullcalendar/core/locales/fi"
import type { DatesSetArg } from "@fullcalendar/core"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useTranslation } from "@/app/i18n/client"
import Card from "@/components/Cards/Card"
import Terminal from "@/components/Cards/Terminal"

import styles from "./CalendarDesktop.module.css"
import type { ProcessedEvent } from "./types"

const MONTHS = [
  "TAM",
  "HEL",
  "MAA",
  "HUH",
  "TOU",
  "KES",
  "HEI",
  "ELO",
  "SYY",
  "LOK",
  "MAR",
  "JOU",
]
const WEEKDAYS = ["su", "ma", "ti", "ke", "to", "pe", "la"]

// Colors come from processEvents in page.tsx.
const LEGEND = [
  { color: "#00ff00", key: "registrationOpen" },
  { color: "#ffff00", key: "registrationNotOpen", hollow: true },
  { color: "#0066ff", key: "canNotRegistration" },
  { color: "#ff0000", key: "registrationClosed" },
  { color: "#6e6e6e", key: "passedEvent" },
] as const

function formatTime(date: Date) {
  const h = date.getHours().toString().padStart(2, "0")
  const m = date.getMinutes().toString().padStart(2, "0")
  return `${h}.${m}`
}

function Swatch({
  color,
  hollow = false,
}: {
  color: string
  hollow?: boolean
}) {
  return (
    <span
      className={styles.swatch}
      style={
        hollow
          ? { border: `2px solid ${color}` }
          : { backgroundColor: color, borderColor: color }
      }
    />
  )
}

export default function CalendarDesktop({
  events,
  onMonthChange,
}: {
  events: ProcessedEvent[]
  onMonthChange: (date: Date) => void
}) {
  const { t } = useTranslation()
  const calendarRef = useRef<FullCalendar>(null)
  const [view, setView] = useState<{ start: Date; end: Date } | null>(null)

  const legendLabel = (key: (typeof LEGEND)[number]["key"]) =>
    t(`event.legend.${key}`)

  const statusOf = (color: string) =>
    LEGEND.find(item => item.color === color) ?? LEGEND[4]

  const calendarEvents = useMemo(
    () =>
      events.map(event => ({
        id: String(event.id),
        title: event.name || "Untitled Event",
        start: event.starts,
        url: `/kalenteri/${event.id}`,
        backgroundColor: "transparent",
        borderColor: "transparent",
        extendedProps: { statusColor: event.backgroundColor },
      })),
    [events],
  )

  const upcoming = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return events
      .filter(event => new Date(event.starts) >= today)
      .sort(
        (a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime(),
      )
  }, [events])

  const api = () => calendarRef.current?.getApi()
  // The visible month is the middle of the displayed range.
  const current = view
    ? new Date((view.start.getTime() + view.end.getTime()) / 2)
    : new Date()
  const monthName = current
    .toLocaleDateString("fi-FI", { month: "long" })
    .toUpperCase()

  const handleDatesSet = (arg: DatesSetArg) => {
    setView({ start: arg.view.currentStart, end: arg.view.currentEnd })
    onMonthChange(arg.view.currentStart)
  }

  return (
    <div className={styles.layout}>
      <ul className={styles.legend}>
        <li className={styles.legendLabel}>{t("event.legendLabel")}:</li>
        {LEGEND.map(item => (
          <li key={item.key} className={styles.legendItem}>
            <Swatch color={item.color} hollow={"hollow" in item} />
            {legendLabel(item.key)}
          </li>
        ))}
      </ul>

      <Card wide className={styles.listCard}>
        <h2 className={styles.listTitle}>{t("event.upcomingTitle")}</h2>
        <div className={styles.listWrap}>
          {upcoming.length === 0 ? (
            <p className={styles.empty}>{t("event.noUpcoming")}</p>
          ) : (
            <ul className={styles.list}>
              {upcoming.map(event => {
                const starts = new Date(event.starts)
                const status = statusOf(event.backgroundColor)
                return (
                  <li key={event.id}>
                    <Link
                      href={`/kalenteri/${event.id}`}
                      className={styles.item}
                    >
                      <span className={styles.dateBox}>
                        <span className={styles.day}>{starts.getDate()}</span>
                        <span className={styles.month}>
                          {MONTHS[starts.getMonth()]}
                        </span>
                      </span>
                      <span className={styles.info}>
                        <span className={styles.name}>{event.name}</span>
                        <span className={styles.meta}>
                          {WEEKDAYS[starts.getDay()]} {formatTime(starts)}
                          {event.location ? ` · ${event.location}` : ""}
                        </span>
                        <span className={styles.status}>
                          <Swatch
                            color={status.color}
                            hollow={"hollow" in status}
                          />
                          {legendLabel(status.key)}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Card>

      <Terminal
        barTitle=""
        heading=""
        mobileCollapsible={false}
        flush
        className={styles.calendarCard}
      >
        <div className={styles.headerRow}>
          <div className={styles.nav}>
            <button
              type="button"
              className={`btn2 ${styles.navButton}`}
              aria-label={t("event.previousMonth")}
              onClick={() => api()?.prev()}
            >
              <ChevronLeft aria-hidden size={18} />
            </button>
            <button
              type="button"
              className={`btn2 ${styles.navButton}`}
              aria-label={t("event.nextMonth")}
              onClick={() => api()?.next()}
            >
              <ChevronRight aria-hidden size={18} />
            </button>
          </div>
          <h2 className={`headingDisplay ${styles.monthTitle}`}>
            {monthName} <span>{current.getFullYear()}</span>
          </h2>
          <button
            type="button"
            className={`btn2 ${styles.todayButton}`}
            onClick={() => api()?.today()}
          >
            {t("event.today")}
          </button>
        </div>
        <div className={styles.calendar}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            locale={fiLocale}
            headerToolbar={false}
            initialView="dayGridMonth"
            height="auto"
            fixedWeekCount={false}
            dayMaxEvents={3}
            editable={false}
            datesSet={handleDatesSet}
            events={calendarEvents}
            eventContent={arg => (
              <span
                className={styles.event}
                style={{ borderLeftColor: arg.event.extendedProps.statusColor }}
              >
                {arg.event.start ? (
                  <span className={styles.eventTime}>
                    {formatTime(arg.event.start)}
                  </span>
                ) : null}
                <span className={styles.eventTitle}>{arg.event.title}</span>
              </span>
            )}
          />
        </div>
      </Terminal>
    </div>
  )
}
