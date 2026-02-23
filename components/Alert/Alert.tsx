import type { ReactNode } from "react"
import styles from "./Alert.module.css"

interface Props {
  title?: string
  children: ReactNode
}

const Alert = ({ title, children }: Props) => {
  return (
    <div className={styles.infoBox}>
      {title && <span className={styles.infoBoxTitle}>{title}</span>}
      <p className={styles.infoBoxText}>{children}</p>
    </div>
  )
}

export default Alert
