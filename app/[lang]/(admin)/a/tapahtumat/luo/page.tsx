import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import EventForm from "../EventForm"
import styles from "./LuoTapahtuma.module.css"
import { getTemplates, postEvent } from "../eventApiConnection"
import { EventFormValues } from "../validators"
import { buildEventPayload } from "../eventPayload"

type Props = {
  params: Promise<{ lang: string }>
}

const AddEventPage = async ({ params }: Props) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)
  const templates = await getTemplates()

  const createEvent = async (formData: EventFormValues) => {
    "use server"
    const payload = buildEventPayload(formData)
    await postEvent(payload)

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
        onSubmit={createEvent}
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
