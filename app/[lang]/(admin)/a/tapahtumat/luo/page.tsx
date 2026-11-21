import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import EventForm from "../EventForm"
import { buildEventPayload } from "../eventPayload"
import styles from "./LuoTapahtuma.module.css"
import { getTemplates } from "../eventApiConnection"

type Props = {
  params: Promise<{ lang: string }>
}

const AddEventPage = async ({ params }: Props) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)
  const templates = await getTemplates()

  const createEvent = async (formData: FormData) => {
    "use server"
    const baseUrl =
      process.env.EVENTS_API_BASE_URL ?? "http://events-microservice:3040"
    const token =
      process.env.EVENT_SERVICE_TOKEN ?? process.env.SERVICE_AUTH_TOKEN

    const payload = buildEventPayload(formData)

    const response = await fetch(`${baseUrl}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Token": token } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Event creation failed with status ${response.status}`)
    }

    revalidatePath(`/${lang}/kalenteri`)
    redirect(`/${lang}/kalenteri`)
  }

  return (
    <main className={styles.main}>
      <PageHeader title={t("luoTapahtuma.title")}>
        {t("luoTapahtuma.descriptionPre")}{" "}
        <i>{t("luoTapahtuma.descriptionEm")}</i>{" "}
        {t("luoTapahtuma.descriptionSuf")}{" "}
        <a href="#" className={styles.link}>
          {t("luoTapahtuma.descriptionLink")}
        </a>
      </PageHeader>

      <EventForm
        action={createEvent}
        templates={templates}
        submitLabel={t("luoTapahtuma.submit")}
        templateLabel={t("luoTapahtuma.templateLabel")}
        templatePlaceholder={t("luoTapahtuma.templatePlaceholder")}
        locale={lang}
      />
    </main>
  )
}

export default AddEventPage
