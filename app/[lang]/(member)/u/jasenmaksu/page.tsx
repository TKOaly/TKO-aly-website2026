import PageHeader from "@/components/PageHeader/PageHeader"
import Accordion from "@/components/Accordion/Accordion"
import { getAsyncTranslation } from "@/app/i18n"

import styles from "./Jasenmaksu.module.css"

type Props = {
  params: Promise<{ lang: string }>
}

const MembershipInvoicePage = async ({ params }: Props) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  return (
    <main className={styles.main}>
      <PageHeader title={t("jasenmaksu.title")} />

      <Accordion summary={t("jasenmaksu.accordionSummary")}>
        <div className={styles.row}>
          <span className={styles.label}>{t("jasenmaksu.payer")}</span>
          <span className={styles.value}>essi maksaja</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>{t("jasenmaksu.membershipType")}</span>
          <span className={styles.value}>Jäsen</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>{t("jasenmaksu.recipient")}</span>
          <span className={styles.value}>TKO-äly ry</span>
        </div>

        <div className={styles.rowGrid}>
          <div className={styles.gridCell}>
            <span className={styles.label}>{t("jasenmaksu.bank")}</span>
            <span className={styles.value}>Bank</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.label}>{t("jasenmaksu.bic")}</span>
            <span className={styles.value}>ESIMSWIF</span>
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>{t("jasenmaksu.iban")}</span>
          <span className={`${styles.value} ${styles.mono}`}>
            FI89 **** **** **12 86
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>{t("jasenmaksu.reference")}</span>
          <span className={`${styles.value} ${styles.ref}`}>1057803</span>
        </div>

        <div className={styles.rowGrid}>
          <div className={styles.gridCell}>
            <span className={styles.label}>{t("jasenmaksu.createdDate")}</span>
            <span className={styles.value}>26.08.2025</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.label}>{t("jasenmaksu.dueDate")}</span>
            <span className={`${styles.value} ${styles.due}`}>Heti</span>
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowMuted}`}>
          <span className={styles.label}>{t("jasenmaksu.membershipEnds")}</span>
          <span className={styles.value}>31.07.2030</span>
        </div>

        <div className={`${styles.rowGrid} ${styles.dashedTop}`}>
          <div className={`${styles.row} ${styles.rowMuted}`}>
            <span className={styles.label}>{t("jasenmaksu.vat")}</span>
            <span className={styles.value}>25,5%</span>
          </div>
          <div className={`${styles.row} ${styles.rowMuted}`}>
            <span className={styles.label}>{t("jasenmaksu.amount")}</span>
            <span className={styles.amount}>15,00 €</span>
          </div>
        </div>
      </Accordion>
    </main>
  )
}

export default MembershipInvoicePage
