import Link from "next/link"
import PageHeader from "@/components/PageHeader/PageHeader"
import { getAsyncTranslation } from "@/app/i18n"
import styles from "./Tapahtumat.module.css"
import { getEditEvents } from "./eventApiConnection"

const TapahtumatPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>
}) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)
  const events = await getEditEvents()

  return (
    <main className={styles.main}>
      <PageHeader title={t("tapahtumaLista.title")}>
        <Link href={`/${lang}/a/tapahtumat/luo`} className={styles.newLink}>
          {t("tapahtumaLista.createNew")}
        </Link>
      </PageHeader>

      {events.length === 0 ? (
        <p className={styles.empty}>{t("tapahtumaLista.noEvents")}</p>
      ) : (
        <ul className={styles.list}>
          {events.map(event => (
            <li key={event.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>
                  {event.name ?? t("tapahtumaLista.unnamed")}
                </span>
                <span className={styles.itemMeta}>
                  {event.starts
                    ? new Date(event.starts).toLocaleString(
                        lang === "fi" ? "fi-FI" : "en-GB",
                        { dateStyle: "medium", timeStyle: "short" },
                      )
                    : "—"}
                  {event.location ? ` · ${event.location}` : ""}
                  {event.category ? ` · ${event.category}` : ""}
                </span>
              </div>
              <Link
                href={`/${lang}/a/tapahtumat/${event.id}`}
                className={styles.editLink}
              >
                {t("tapahtumaLista.edit")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default TapahtumatPage
