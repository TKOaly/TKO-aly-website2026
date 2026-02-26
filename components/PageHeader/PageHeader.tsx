import type { ReactNode } from "react"
import styles from "./PageHeader.module.css"

interface Props {
  title: string
  description?: string
  children?: ReactNode
}
const PageHeader = ({ title, description, children }: Props) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {(description || children) && (
        <p className={styles.description}>{description ?? children}</p>
      )}
    </header>
  )
}

export default PageHeader
