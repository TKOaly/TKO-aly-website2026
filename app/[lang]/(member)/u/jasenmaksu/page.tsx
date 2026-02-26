import PageHeader from "@/components/PageHeader/PageHeader"
import Accordion from "@/components/Accordion/Accordion"

import styles from "./Jasenmaksu.module.css"

const MembershipInvoicePage = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Payment Confirmation" />

      <Accordion summary="Membership Invoice">
        <div className={styles.row}>
          <span className={styles.label}>Maksaja</span>
          <span className={styles.value}>essi maksaja</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Haettava jäsenyys</span>
          <span className={styles.value}>Jäsen</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Saaja</span>
          <span className={styles.value}>TKO-äly ry</span>
        </div>

        <div className={styles.rowGrid}>
          <div className={styles.gridCell}>
            <span className={styles.label}>Pankki</span>
            <span className={styles.value}>Bank</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.label}>BIC</span>
            <span className={styles.value}>ESIMSWIF</span>
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>IBAN</span>
          <span className={`${styles.value} ${styles.mono}`}>
            FI89 **** **** **12 86
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Viitenumero</span>
          <span className={`${styles.value} ${styles.ref}`}>1057803</span>
        </div>

        <div className={styles.rowGrid}>
          <div className={styles.gridCell}>
            <span className={styles.label}>Luontipäivä</span>
            <span className={styles.value}>26.08.2025</span>
          </div>
          <div className={styles.gridCell}>
            <span className={styles.label}>Eräpäivä</span>
            <span className={`${styles.value} ${styles.due}`}>Heti</span>
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowMuted}`}>
          <span className={styles.label}>Jäsenyys päättyy</span>
          <span className={styles.value}>31.07.2030</span>
        </div>

        <div className={`${styles.rowGrid} ${styles.dashedTop}`}>
          <div className={`${styles.row} ${styles.rowMuted}`}>
            <span className={styles.label}>Alv.</span>
            <span className={styles.value}>25,5%</span>
          </div>
          <div className={`${styles.row} ${styles.rowMuted}`}>
            <span className={styles.label}>Summa</span>
            <span className={styles.amount}>15,00 €</span>
          </div>
        </div>
      </Accordion>
    </main>
  )
}

export default MembershipInvoicePage
