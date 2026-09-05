import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"
import EventForm from "../EventForm"
import { buildEventPayload } from "../eventPayload"
import type { EventFormValues } from "../types"
import styles from "../luo/LuoTapahtuma.module.css"

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) => {
  const { lang, slug } = await params
  const { t } = await getAsyncTranslation(lang)

  const eventId = Number(slug)
  if (Number.isNaN(eventId)) notFound()

  const baseUrl =
    process.env.EVENTS_API_BASE_URL ?? "http://events-service:3040"
  const token =
    process.env.EVENT_SERVICE_TOKEN ?? process.env.SERVICE_AUTH_TOKEN

  const res = await fetch(`${baseUrl}/api/events/${eventId}`, {
    headers: token ? { "X-Token": token } : {},
    cache: "no-store",
  })

  if (!res.ok) notFound()

  const event: EventFormValues = await res.json()

  const updateEvent = async (formData: FormData) => {
    "use server"
    const baseUrl =
      process.env.EVENTS_API_BASE_URL ?? "http://events-microservice:3040"
    const token =
      process.env.EVENT_SERVICE_TOKEN ?? process.env.SERVICE_AUTH_TOKEN

    const payload = buildEventPayload(formData)

    const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Token": token } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Event update failed with status ${response.status}`)
    }

    revalidatePath(`/${lang}/kalenteri`)
    redirect(`/${lang}/kalenteri`)
  }

  return (
    <main className={styles.main}>
      <PageHeader title={t("muokkaaTapahtuma.title")} />
      <EventForm
        action={updateEvent}
        defaultValues={event}
        t={t}
        submitLabel={t("muokkaaTapahtuma.submit")}
      />
    </main>
  )
}

export default EditEventPage
