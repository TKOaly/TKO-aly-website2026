import styles from "./PageHeader.module.css"

interface Props {
  title: string
  description?: string
}
const PageHeader = ({ title, description }: Props) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  )
}

export default PageHeader
