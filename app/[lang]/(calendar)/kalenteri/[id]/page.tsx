"use client"

import Link from "next/link"
import { ReactNode, useMemo, useState, use } from "react"
import { ListTree } from "lucide-react"
import type { Event, ProcessedEvent } from "../types"
import { useTranslation } from "@/app/i18n/client"
import styles from "../Kalenteri.module.css"
import { processEvents } from "../page"
import { upcomingEvents } from "../calendarShared"
import UpcomingList, { UpcomingPanel } from "../UpcomingList"
import pageStyles from "./EventPage.module.css"
import Card from "@/components/Cards/Card"
import Drawer from "@/components/Drawer/Drawer"
import { useQuery } from "@tanstack/react-query"
import { getEventById, getEventList } from "../eventApiConnection"
import { notFound } from "next/navigation"

function formatTime(time?: string): string | null {
  if (!time) {
    return null
  }
  const d = new Date(time)
  return `${d.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  })} ${d.toLocaleDateString("fi-FI")}`
}

function formatPrice(price: string): string {
  const trimmed = price.trim()
  // Regex: one or more digits, optionally followed by a dot or comma and more digits.
  return /^\d+([.,]\d+)?$/.test(trimmed) ? `${trimmed} €` : trimmed
}

const AlcoholMeter = ({ value }: { value: number }) => {
  const { t } = useTranslation()
  const levels = [0, 1, 2, 3, 4]

  return (
    <div className={styles.alcoholMeterContainer}>
      <div className={styles.alcoholMeter}>
        {levels.map(level => (
          <div
            key={level}
            className={value === level ? styles.alcoholMeterSelected : ""}
          >
            {level}
          </div>
        ))}
      </div>
      <details>
        <summary>
          <span>{t("alcoholMeterInfo.title")}</span>
        </summary>
        <div className={styles.alcoholMeterInfo}>
          {t(`alcoholMeterInfo.${value}`)}
        </div>
      </details>
    </div>
  )
}

const Row = ({ col_1, col_2 }: { col_1: ReactNode; col_2: ReactNode }) => {
  return (
    <dl className={styles.eventInfoRow}>
      <dt>{col_1}</dt>
      <dd>{col_2}</dd>
    </dl>
  )
}

const EventInfoView = ({ event }: { event: Event }) => {
  const { t } = useTranslation()

  return (
    <>
      <h1 className={styles.eventTitle}>{event.name}</h1>
      <div className={styles.eventInfo}>
        <Row col_1={<>{t("event.time")}:</>} col_2={formatTime(event.starts)} />

        <Row
          col_1={<>{t("event.location")}:</>}
          col_2={
            <>
              {event.location}{" "}
              {event.map && <Link href={event.map}>{t("event.map")}</Link>}
            </>
          }
        />

        {!!event.category && (
          <Row col_1={<>{t("event.category")}:</>} col_2={event.category} />
        )}

        {!!event.alcohol_meter && (
          <Row
            col_1={<>{t("event.alcoholMeter")}:</>}
            col_2={<AlcoholMeter value={event.alcohol_meter} />}
          />
        )}

        {!!event.organizer && (
          <Row
            col_1={<>{t("event.organizer")}:</>}
            col_2={
              event.organizer_url ? (
                <Link href={event.organizer_url}>{event.organizer}</Link>
              ) : (
                <p>{event.organizer}</p>
              )
            }
          />
        )}

        {!!event.price && (
          <Row
            col_1={<>{t("event.price")}:</>}
            col_2={formatPrice(event.price)}
          />
        )}

        {!!event.registration_starts && !!event.registration_ends && (
          <>
            <Row
              col_1={<>{t("event.registration")}:</>}
              col_2={
                <>
                  {formatTime(event.registration_starts)} -{" "}
                  {formatTime(event.registration_ends)}
                </>
              }
            />

            {!!event.cancellation_starts && !!event.cancellation_ends ? (
              <Row
                col_1={<>{t("event.canCancel")}:</>}
                col_2={
                  <>
                    {formatTime(event.cancellation_starts)} -{" "}
                    {formatTime(event.cancellation_ends)}
                  </>
                }
              />
            ) : (
              <Row col_1={<>{t("event.canNotCancel")}:</>} col_2="" />
            )}
          </>
        )}

        {!!event.show_responsible && !!event.responsible && (
          <Row
            col_1={<>{t("event.responsible")}:</>}
            col_2={event.responsible}
          />
        )}
      </div>
      {!!event.description && (
        <div
          className={styles.eventText}
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      )}
    </>
  )
}

const EventDisclaimer = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.eventSafetyDisclaimer}>
      <p>
        {t("event.safety.text.safetySpace")}{" "}
        <Link href="https://www.tko-aly.fi/turva">
          {t("event.safety.link.text")}
        </Link>
        . {t("event.safety.text.harrasmentContact1")}{" "}
        <Link href="https://www.tko-aly.fi/häirintälomake">
          {t("event.safety.link.form")}
        </Link>
        {t("event.safety.text.harrasmentContact2")}.{" "}
        {t("event.safety.text.feedback")}{" "}
        <Link href="https://www.tko-aly.fi/palaute">
          {t("event.safety.link.text")}
        </Link>
        .
      </p>
    </div>
  )
}

const BackButton = () => {
  const { t } = useTranslation()

  return (
    <Link href="/kalenteri" className={`btn2 ${styles.backLink}`}>
      ← {t("event.back")}
    </Link>
  )
}

const EventPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = use(params)
  const { t } = useTranslation()

  const now = new Date()
  const fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const id = /^\d+$/.test(rawId) ? Number(rawId) : NaN
  if (!Number.isSafeInteger(id) || id < 0) {
    notFound()
  }

  const {
    data: eventsList = [],
    error: eventsListError,
    isLoading: isEventsListLoading,
  } = useQuery({
    queryKey: ["eventList", fromDate],
    queryFn: () => getEventList(fromDate),
  })

  const processedEvents: ProcessedEvent[] = useMemo(() => {
    if (eventsListError || !eventsList) {
      return []
    }
    return processEvents(eventsList as Event[])
  }, [eventsList, eventsListError])

  const {
    data: event,
    error: eventError,
    isLoading: isEventsLoading,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
  })

  let eventPageContent: ReactNode

  if (isEventsLoading) {
    eventPageContent = <p>{t("event.loading.event")}</p>
  } else if (!event || eventError) {
    eventPageContent = <p>{t("event.notExist.event")}</p>
  } else {
    eventPageContent = (
      <>
        <EventInfoView event={event} />
        {event.registration_starts && (
          <Link
            href={`https://tko-aly.fi/event/${event.id}`}
            className={styles.eventRegistration}
          >
            {t("event.registrationLink")}
          </Link>
        )}
        <EventDisclaimer />
      </>
    )
  }

  const upcoming = useMemo(
    () => upcomingEvents(processedEvents),
    [processedEvents],
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div id={styles.calendarColor}>
      <div className={`${styles.container} ${pageStyles.page}`}>
        <BackButton />
        <div className={pageStyles.detailLayout}>
          <Card wide className={pageStyles.detailList}>
            <UpcomingPanel
              events={processedEvents}
              ready={!isEventsListLoading && !eventsListError}
            />
          </Card>
          <Card wide className={pageStyles.detailCard}>
            {eventPageContent}
          </Card>
        </div>

        {/* Mobile: floating button that opens the upcoming events in a drawer. */}
        <button
          type="button"
          className={`btn ${pageStyles.listFab}`}
          onClick={() => setDrawerOpen(true)}
          aria-haspopup="dialog"
        >
          <ListTree size={18} aria-hidden /> {t("event.eventsShort")}
        </button>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          closeLabel={t("common.close")}
          title={t("event.upcomingTitle")}
        >
          {!isEventsListLoading && !eventsListError ? (
            <UpcomingList events={upcoming} />
          ) : null}
        </Drawer>
      </div>
    </div>
  )
}

export default EventPage
