"use client"

import Link from "next/link"
import { ReactNode, useMemo, use } from "react"
import type { Event, ProcessedEvent } from "../types"
import { useTranslation } from "@/app/i18n/client"
import styles from "../Kalenteri.module.css"
import { EventListView, Legend, processEvents } from "../page"
import { useQuery } from "@tanstack/react-query"

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

const AlcoholMeter = async ({ value }: { value: number }) => {
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

const EventView = ({ event }: { event: Event }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
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

        <Row col_1={<>{t("event.category")}:</>} col_2={event.category} />

        {event.alcohol_meter && (
          <Row
            col_1={<>{t("event.alcoholMeter")}:</>}
            col_2={<AlcoholMeter value={event.alcohol_meter} />}
          />
        )}

        {event.organizer && (
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

        {event.price && (
          <Row col_1={<>{t("event.price")}:</>} col_2={<>{event.price} €</>} />
        )}

        {event.registration_starts && event.registration_ends && (
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

            {event.cancellation_starts && event.cancellation_ends ? (
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

        {event.show_responsible && event.responsible && (
          <Row
            col_1={<>{t("event.responsible")}:</>}
            col_2={event.responsible}
          />
        )}
      </div>
      <p className={styles.eventText}>{event.description}</p>
      {event.registration_starts && (
        <Link
          href={`https://tko-aly.fi/event/${event.id}`}
          className={styles.eventRegistration}
        >
          Ilmoittautuminen
        </Link>
      )}
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
    </div>
  )
}

const BackButton = () => {
  const { t } = useTranslation()

  return (
    <div style={{display:"flex", justifyContent:"flex-start", width:"100%", marginBottom: "1rem"}}>
      <Link href={"/kalenteri"} className={styles.eventRegistration}>
        {t("event.back")}{" "}
      </Link>
    </div>
  )
}

const EventPage = ({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) => {
  const { lang, slug } = use(params)
  const { t } = useTranslation()

  const { data: eventsList = [], error } = useQuery({
    queryKey: ["events"],
    queryFn: (): Promise<Event[]> => fetch("/api/events").then(r => r.json()),
  })

  const id = slug[0]
  const event = eventsList.find(e => String(e.id) === id)

  const processedEvents: ProcessedEvent[] = useMemo(() => {
    return processEvents(eventsList as Event[])
  }, [eventsList])

  return event && !error ? (
    <div id={styles.calendar}>
      <BackButton/>
      <div id={styles.calenderPageContainer}>
        <div className={styles.eventsListEventPageContainer}>
          <EventListView events={processedEvents} />
        </div>
        <div style={{ marginLeft: "48px", width: "95%" }}>
          <EventView event={event} />
        </div>
      </div>
    </div>
  ) : (
    <div id={styles.calendar}>
      <BackButton/>
      <p>{t("event.notExits")}</p>
    </div>
  )
}

export default EventPage
