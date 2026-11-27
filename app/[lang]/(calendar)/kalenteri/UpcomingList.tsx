"use client"

import { useMemo } from "react"
import Link from "next/link"

import { useTranslation } from "@/app/i18n/client"

import {
  dateLocale,
  formatTime,
  shortMonth,
  statusOf,
  Swatch,
  upcomingEvents,
} from "./calendarShared"
import styles from "./UpcomingList.module.css"
import type { ProcessedEvent } from "./types"

export default function UpcomingList({
  events,
  className,
}: {
  events: ProcessedEvent[]
  /** Extra class for the list element. */
  className?: string
}) {
  const { t, lang } = useTranslation()
  const locale = dateLocale(lang)

  if (events.length === 0) {
    return <p className={styles.empty}>{t("event.noUpcoming")}</p>
  }

  return (
    <ul className={`${styles.list} ${className ?? ""}`}>
      {events.map(event => {
        const starts = new Date(event.starts)
        const status = statusOf(event.backgroundColor)
        return (
          <li key={event.id}>
            <Link href={`/kalenteri/${event.id}`} className={styles.item}>
              <span className={styles.dateBox}>
                <span className={styles.day}>{starts.getDate()}</span>
                <span className={styles.month}>
                  {shortMonth(starts, locale)}
                </span>
              </span>
              <span className={styles.info}>
                <span className={styles.name}>{event.name}</span>
                <span className={styles.meta}>
                  {starts.toLocaleDateString(locale, { weekday: "short" })}{" "}
                  {formatTime(starts)}
                  {event.location ? ` · ${event.location}` : ""}
                </span>
                <span className={styles.status}>
                  <Swatch color={status.color} hollow={"hollow" in status} />
                  {t(`event.legend.${status.key}`)}
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function UpcomingPanel({
  events,
  ready = true,
}: {
  events: ProcessedEvent[]
  ready?: boolean
}) {
  const { t } = useTranslation()
  const upcoming = useMemo(() => upcomingEvents(events), [events])

  return (
    <>
      <h2 className={styles.panelTitle}>{t("event.upcomingTitle")}</h2>
      <div className={styles.panelWrap}>
        {ready ? (
          <UpcomingList events={upcoming} className={styles.panelList} />
        ) : null}
      </div>
    </>
  )
}
