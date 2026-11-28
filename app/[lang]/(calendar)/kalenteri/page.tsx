"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import styles from "./Kalenteri.module.css"
import { useState, ReactNode, useMemo, useCallback } from "react"
import type { Event, ProcessedEvent } from "./types"
import { useTranslation } from "@/app/i18n/client"
import { getEventList } from "./eventApiConnection"
import { STATUS_COLORS } from "./calendarShared"
import CalendarDesktop from "./CalendarDesktop"
import CalendarMobile from "./CalendarMobile"

function hasValidStartTime(event: Event): event is Event & { starts: string } {
  return event.starts !== undefined
}

export function processEvents(eventsData: Event[]): ProcessedEvent[] {
  const now = new Date()

  return eventsData
    .filter(hasValidStartTime)
    .map(event => {
      const registrationStarts = event.registration_starts
        ? new Date(event.registration_starts)
        : null
      const registrationEnds = event.registration_ends
        ? new Date(event.registration_ends)
        : null
      const start = new Date(event.starts)
      let backgroundColor: string

      if (!registrationStarts || !registrationEnds) {
        backgroundColor =
          now < start ? STATUS_COLORS.noRegistration : STATUS_COLORS.passed
      } else if (now >= registrationStarts && now <= registrationEnds) {
        backgroundColor = STATUS_COLORS.open
      } else if (now < registrationStarts) {
        backgroundColor = STATUS_COLORS.notOpen
      } else if (now > start) {
        backgroundColor = STATUS_COLORS.passed
      } else {
        backgroundColor = STATUS_COLORS.closed
      }

      return { ...event, backgroundColor }
    })
    .reverse()
}

export default function Calendar() {
  const { t } = useTranslation()

  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const handleMonthChange = useCallback((date: Date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1)
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    if (first <= currentMonth) {
      setViewMonth(prev => (prev.getTime() === first.getTime() ? prev : first))
    }
  }, [])

  const fromDate = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() - 1,
    1,
  )

  const {
    data: eventsList = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["eventList", fromDate],
    queryFn: () => getEventList(fromDate),
    placeholderData: keepPreviousData,
  })

  const processedEvents: ProcessedEvent[] = useMemo(() => {
    if (error || !eventsList) {
      return []
    }

    return processEvents(eventsList as Event[])
  }, [eventsList, error])

  let viewContent: ReactNode

  if (isLoading) {
    viewContent = <p>{t("event.loading.calendar")}</p>
  } else if (error) {
    viewContent = <p>{t("event.notExist.calendar")}</p>
  } else {
    viewContent = (
      <>
        <div className={styles.desktopOnly}>
          <CalendarDesktop
            events={processedEvents}
            onMonthChange={handleMonthChange}
          />
        </div>
        <div className={styles.mobileOnly}>
          <CalendarMobile
            events={processedEvents}
            onMonthChange={handleMonthChange}
          />
        </div>
      </>
    )
  }

  return (
    <div id={styles.calendarColor}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("event.calendar")}</h1>
        {viewContent}
      </div>
    </div>
  )
}
