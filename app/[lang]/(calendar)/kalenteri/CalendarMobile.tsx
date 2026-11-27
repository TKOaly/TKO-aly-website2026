"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useTranslation } from "@/app/i18n/client"
import Card from "@/components/Cards/Card"
import Drawer from "@/components/Drawer/Drawer"

import {
  dateLocale,
  formatTime,
  LEGEND,
  statusOf,
  Swatch,
  upcomingEvents,
  weekdayHeaders,
} from "./calendarShared"
import styles from "./CalendarMobile.module.css"
import type { ProcessedEvent } from "./types"
import UpcomingList from "./UpcomingList"

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

const isSameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b)

/** Monday-first grid covering the whole month. */
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()
  const rows = Math.ceil((offset + daysInMonth) / 7)
  return Array.from(
    { length: rows * 7 },
    (_, i) => new Date(month.getFullYear(), month.getMonth(), i - offset + 1),
  )
}

export default function CalendarMobile({
  events,
  onMonthChange,
}: {
  events: ProcessedEvent[]
  onMonthChange: (date: Date) => void
}) {
  const { t, lang } = useTranslation()
  const locale = dateLocale(lang)
  const today = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selected, setSelected] = useState(today)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tab, setTab] = useState<"calendar" | "list">("calendar")
  const tabsId = useId()

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ProcessedEvent[]>()
    for (const event of events) {
      const key = dayKey(new Date(event.starts))
      map.set(key, [...(map.get(key) ?? []), event])
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime(),
      )
    }
    return map
  }, [events])

  const upcoming = useMemo(() => upcomingEvents(events), [events])
  const days = useMemo(() => monthGrid(month), [month])
  const selectedEvents = eventsByDay.get(dayKey(selected)) ?? []

  const goToMonth = (date: Date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1)
    setMonth(first)
    onMonthChange(first)
  }

  const monthName = month
    .toLocaleDateString(locale, { month: "long" })
    .toUpperCase()

  return (
    <div className={styles.root}>
      <div
        role="tablist"
        className={styles.tabs}
        onKeyDown={event => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            const next = tab === "calendar" ? "list" : "calendar"
            setTab(next)
            document.getElementById(`${tabsId}-tab-${next}`)?.focus()
          }
        }}
      >
        {(["calendar", "list"] as const).map(name => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`${tabsId}-tab-${name}`}
            aria-selected={tab === name}
            aria-controls={`${tabsId}-panel-${name}`}
            tabIndex={tab === name ? 0 : -1}
            className={styles.tab}
            onClick={() => setTab(name)}
          >
            {t(name === "calendar" ? "event.tabCalendar" : "event.tabList")}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-panel-calendar`}
        aria-labelledby={`${tabsId}-tab-calendar`}
        hidden={tab !== "calendar"}
        className={styles.panel}
      >
        <Card wide className={styles.calendarCard}>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={`btn2 ${styles.navButton}`}
              aria-label={t("event.previousMonth")}
              onClick={() =>
                goToMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1, 1),
                )
              }
            >
              <ChevronLeft aria-hidden size={18} />
            </button>
            <h2 className={`headingDisplay ${styles.monthTitle}`}>
              {monthName} <span>{month.getFullYear()}</span>
            </h2>
            <button
              type="button"
              className={`btn2 ${styles.navButton}`}
              aria-label={t("event.nextMonth")}
              onClick={() =>
                goToMonth(
                  new Date(month.getFullYear(), month.getMonth() + 1, 1),
                )
              }
            >
              <ChevronRight aria-hidden size={18} />
            </button>
          </div>

          <div className={styles.grid}>
            {weekdayHeaders(locale).map(name => (
              <span key={name} className={styles.weekday}>
                {name}
              </span>
            ))}
            {days.map(date => {
              const dayEvents = eventsByDay.get(dayKey(date)) ?? []
              const isOtherMonth = date.getMonth() !== month.getMonth()
              const isToday = isSameDay(date, today)
              const isSelected = isSameDay(date, selected)
              return (
                <button
                  key={dayKey(date)}
                  type="button"
                  className={`${styles.day} ${isOtherMonth ? styles.otherMonth : ""} ${isSelected ? styles.selected : ""}`}
                  aria-pressed={isSelected}
                  aria-label={`${date.toLocaleDateString(locale)}, ${dayEvents.length} ${t(dayEvents.length === 1 ? "event.eventSingular" : "event.eventPlural")}`}
                  onClick={() => {
                    setSelected(date)
                    if (isOtherMonth) goToMonth(date)
                    // Only open the drawer when there is something to show.
                    setDrawerOpen(dayEvents.length > 0)
                  }}
                >
                  <span className={isToday ? styles.today : styles.dayNumber}>
                    {date.getDate()}
                  </span>
                  <span className={styles.dots}>
                    {dayEvents.slice(0, 3).map(event => {
                      const status = statusOf(event.backgroundColor)
                      return (
                        <Swatch
                          key={event.id}
                          color={status.color}
                          hollow={"hollow" in status}
                          size={6}
                        />
                      )
                    })}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        <ul className={styles.legend} aria-label={t("event.legendLabel")}>
          {LEGEND.map(item => (
            <li key={item.key} className={styles.legendItem}>
              <Swatch color={item.color} hollow={"hollow" in item} />
              {t(`event.legend.${item.key}`)}
            </li>
          ))}
        </ul>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          closeLabel={t("common.close")}
          title={
            <>
              {selected
                .toLocaleDateString(locale, { weekday: "long" })
                .toUpperCase()}{" "}
              {selected.toLocaleDateString(locale, {
                day: "numeric",
                month: "numeric",
              })}{" "}
              <span className={styles.count}>
                {selectedEvents.length}{" "}
                {t(
                  selectedEvents.length === 1
                    ? "event.eventSingular"
                    : "event.eventPlural",
                )}
              </span>
            </>
          }
        >
          <ul className={styles.dayEvents}>
            {selectedEvents.map(event => {
              const starts = new Date(event.starts)
              const status = statusOf(event.backgroundColor)
              return (
                <li key={event.id}>
                  <Link
                    href={`/kalenteri/${event.id}`}
                    className={styles.dayEvent}
                    style={{ borderLeftColor: status.color }}
                  >
                    <span className={styles.dayEventMeta}>
                      {formatTime(starts)}
                      {event.location ? ` · ${event.location}` : ""}
                    </span>
                    <span className={styles.dayEventName}>{event.name}</span>
                    <span className={styles.dayEventStatus}>
                      <Swatch
                        color={status.color}
                        hollow={"hollow" in status}
                      />
                      {t(`event.legend.${status.key}`)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Drawer>
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-panel-list`}
        aria-labelledby={`${tabsId}-tab-list`}
        hidden={tab !== "list"}
        className={styles.panel}
      >
        <UpcomingList events={upcoming} />
      </div>
    </div>
  )
}
