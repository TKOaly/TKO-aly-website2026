import styles from "./SkipLink.module.css"

/** First focusable element on every page: lets keyboard users bypass the navbar. */
export default function SkipLink({ label }: { label: string }) {
  return (
    <a href="#main-content" className={styles.skipLink}>
      {label}
    </a>
  )
}
