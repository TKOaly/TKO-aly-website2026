"use client"

import { useMemo, useRef, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import fiLocale from "@fullcalendar/core/locales/fi"
import enGbLocale from "@fullcalendar/core/locales/en-gb"
import type { DatesSetArg } from "@fullcalendar/core"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useTranslation } from "@/app/i18n/client"
import Card from "@/components/Cards/Card"
import Terminal from "@/components/Cards/Terminal"

import { dateLocale, formatTime, LEGEND, Swatch } from "./calendarShared"
import styles from "./CalendarDesktop.module.css"
import { UpcomingPanel } from "./UpcomingList"
import type { ProcessedEvent } from "./types"

export default function CalendarDesktop({
  events,
  onMonthChange,
}: {
  events: ProcessedEvent[]
  onMonthChange: (date: Date) => void
}) {
  const { t, lang } = useTranslation()
  const locale = dateLocale(lang)
  const calendarRef = useRef<FullCalendar>(null)
  const [view, setView] = useState<{ start: Date; end: Date } | null>(null)

  const legendLabel = (key: (typeof LEGEND)[number]["key"]) =>
    t(`event.legend.${key}`)

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

  const api = () => calendarRef.current?.getApi()
  // The visible month is the middle of the displayed range.
  const current = view
    ? new Date((view.start.getTime() + view.end.getTime()) / 2)
    : new Date()
  const monthName = current
    .toLocaleDateString(locale, { month: "long" })
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
        <UpcomingPanel events={events} />
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
            locale={locale === "en-GB" ? enGbLocale : fiLocale}
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
