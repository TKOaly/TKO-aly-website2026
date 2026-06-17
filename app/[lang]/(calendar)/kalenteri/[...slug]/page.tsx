import Link from "next/link"
import { ReactNode } from "react"
import type { Event } from "../types"
import { getAsyncTranslation } from "@/app/i18n"

async function getEventById(id: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/${id}`
    const secret = process.env.EVENT_SERVICE_TOKEN || ""

    const response = await fetch(targetUrl, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        "X-Token": secret,
      },
    })

    if (!response.ok) return null

    const event: Event = await response.json()

    return event
  } catch (error) {
    console.error("Failed to fetch event by id", error, id)
    return null
  }
}

const AlcoholMeter = async ({
  value,
  lang,
}: {
  value: number
  lang: string
}) => {
  const { t } = await getAsyncTranslation(lang)
  const levels = [0, 1, 2, 3, 4]

  return (
    <div className="alcohol-meter">
      <div className="meter">
        {levels.map(level => (
          <div
            key={level}
            className={value === level ? "selected" : "unselected"}
          >
            {level}
          </div>
        ))}
      </div>
      <details>
        <summary>
          <span>{t("alcoholMeterInfo.title")}</span>
        </summary>
        <div className="alcohol-meter-info">
          {t(`alcoholMeterInfo.${value}`)}
        </div>
      </details>
    </div>
  )
}

const Row = ({ col_1, col_2 }: { col_1: ReactNode; col_2: ReactNode }) => {
  return (
    <div>
      <dt>{col_1}</dt>
      <dd>{col_2}</dd>
    </div>
  )
}

const EventPage = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) => {
  const { lang, slug } = await params
  const { t } = await getAsyncTranslation(lang)

  const id = slug[0]
  const event = await getEventById(id)

  return event ? (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Row col_1={t("event.time")} col_2={event.starts} />

        <Row
          col_1={t("event.location")}
          col_2={
            <>
              {event.location}{" "}
              {event.map && <Link href={event.map}>{t("event.map")}</Link>}
            </>
          }
        />

        <Row col_1={t("event.category")} col_2={event.category} />

        {event.alcohol_meter && (
          <Row
            col_1={t("event.alcoholMeter")}
            col_2={<AlcoholMeter value={event.alcohol_meter} lang={lang} />}
          />
        )}

        {event.organizer && (
          <Row
            col_1={t("event.organizer")}
            col_2={
              event.organizer_url ? (
                <Link href={event.organizer_url}>{event.organizer}</Link>
              ) : (
                <p>{event.organizer}</p>
              )
            }
          />
        )}

        {event.price && <Row col_1={t("event.price")} col_2={event.price} />}

        {event.registration_starts && event.registration_ends && (
          <>
            <Row
              col_1={t("event.registration")}
              col_2={
                <>
                  {event.registration_starts} - {event.registration_ends}
                </>
              }
            />

            {event.cancellation_starts && event.cancellation_ends ? (
              <Row
                col_1={t("event.canCancel")}
                col_2={
                  <>
                    {event.cancellation_starts} - {event.cancellation_ends}
                  </>
                }
              />
            ) : (
              <Row col_1={t("event.canNotCancel")} col_2="" />
            )}
          </>
        )}

        {event.show_responsible && event.responsible && (
          <Row col_1={t("event.responsible")} col_2={event.responsible} />
        )}
      </div>

      <p>{event.description}</p>
    </div>
  ) : (
    <div>
      <p>{t("event.notExits")}</p>
    </div>
  )
}

export default EventPage
