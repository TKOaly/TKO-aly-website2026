import type { ReactNode } from "react"

import styles from "./Terminal.module.css"

interface Props {
  barTitle?: string
  heading?: string
  callToAction?: ReactNode
  children: ReactNode
}

const Terminal = ({
  barTitle = "readme.md",
  heading = "Tervetuloa!",
  callToAction,
  children,
}: Props) => {
  return (
    <section className={styles.terminal}>
      <div className={styles.topBar}>
        <div className={styles.dots}>
          <span className={styles.redDot}></span>
          <span className={styles.dot}></span>
          <span className={styles.greenDot}></span>
        </div>
        <span className={styles.barTitle}>{barTitle}</span>
        <div className={styles.spacer}></div>
      </div>
      <div className={styles.desktopContent}>
        <div className={styles.contentInner}>
          <h2 className={styles.heading}>{heading}</h2>
          <p>{children}</p>
        </div>
        {callToAction ? (
          <a className={`${styles.link} ${styles.desktopLink}`} href="#">
            Lue lisää
          </a>
        ) : null}
      </div>
      <div className={styles.mobileContent}>
        <details className={styles.details}>
          <summary className={styles.summary}>
            <h2 className={styles.heading}>{heading}</h2>
          </summary>
          <p className={styles.text}>{children}</p>
        </details>
        {callToAction ? (
          <a className={`${styles.link} ${styles.desktopLink}`} href="#">
            Lue lisää
          </a>
        ) : null}
      </div>
    </section>
  )
}

export default Terminal
