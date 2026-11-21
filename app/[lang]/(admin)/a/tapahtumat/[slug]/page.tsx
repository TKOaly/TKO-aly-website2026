import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"
import EventForm from "../EventForm"
import { buildEventPayload } from "../eventPayload"
import type { Event, EventFormValues } from "../validators"
import styles from "../luo/LuoTapahtuma.module.css"
import { putEvent } from "../eventApiConnection"

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
    process.env.EVENTS_API_BASE_URL ?? "http://events-microservice:3040"
  const token =
    process.env.EVENT_SERVICE_TOKEN ?? process.env.SERVICE_AUTH_TOKEN

  const res = await fetch(`${baseUrl}/api/events/${eventId}`, {
    headers: token ? { "X-Token": token } : {},
    cache: "no-store",
  })

  if (!res.ok) notFound()

  const event: Event = await res.json()

  const updateEvent = async (formData: EventFormValues) => {
    "use server"
    const payload = buildEventPayload(formData)
    await putEvent(eventId, payload)

    revalidatePath(`/${lang}/kalenteri`)
    redirect(`/${lang}/kalenteri`)
  }

  return (
    <main className={styles.main}>
      <PageHeader title={t("muokkaaTapahtuma.title")} />
      <EventForm
        onSubmit={updateEvent}
        defaultValues={event}
        submitLabel={t("muokkaaTapahtuma.submit")}
        locale={lang}
      />
    </main>
  )
}

export default EditEventPage
