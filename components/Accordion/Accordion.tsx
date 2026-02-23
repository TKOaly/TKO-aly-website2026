import type { ReactNode } from "react"
import styles from "./Accordion.module.css"

interface Props {
  summary: string
  children: ReactNode
}

const Accordion = ({ summary, children }: Props) => {
  return (
    <details open className={styles.card}>
      <summary className={styles.cardHeader}>
        <span>{summary}</span>
        <span className={styles.shieldIcon}>&#9673;</span>
      </summary>

      <div className={styles.rows}>{children}</div>
    </details>
  )
}

export default Accordion
