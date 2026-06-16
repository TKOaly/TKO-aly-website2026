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
          <span>{t("alcoholMeter.info.title")}</span>
        </summary>
        <div className="alcohol-meter-info">
          {t(`alcoholMeter.info.${value}`)}
        </div>
      </details>
    </div>
  )
}

const EventPage = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) => {
  const { lang, slug } = await params

  const id = slug[0]
  const event = await getEventById(id)

  return event ? (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p>Aika: {event.starts}</p>
      <p>Paikka: {event.location}</p>
      <p>Tyyppi: {event.category}</p>
      {event.show_responsible ? (
        <p>Vastuu henkilö: {event.responsible}</p>
      ) : null}
      {event.alcohol_meter ? (
        <AlcoholMeter value={event.alcohol_meter} lang={lang} />
      ) : null}
      <p>{event.description}</p>
    </div>
  ) : (
    <div>
      <p>Tapahtumaa ei ole olemassa</p>
    </div>
  )
}

export default EventPage
