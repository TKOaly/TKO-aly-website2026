import type { ReactNode } from "react"
import styles from "./Card.module.css"

const Card = ({ children }: { children: ReactNode }) => {
  return <div className={styles.card}>{children}</div>
}

export default Card
