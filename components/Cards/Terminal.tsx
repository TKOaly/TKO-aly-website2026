import type { ReactNode } from "react"

import styles from "./Terminal.module.css"

interface Props {
  barTitle?: string
  heading?: string
  callToAction?: ReactNode
  mobileCollapsible?: boolean
  /** Content shown at the right end of the title bar. */
  barAside?: ReactNode
  /** No inner padding or width limit, for tables, lists and calendars. */
  flush?: boolean
  className?: string
  children: ReactNode
}

const Terminal = ({
  barTitle = "readme.md",
  heading = "Tervetuloa!",
  callToAction,
  mobileCollapsible = true,
  barAside,
  flush = false,
  className,
  children,
}: Props) => {
  return (
    <section
      className={`${styles.terminal} ${flush ? styles.flush : ""} ${className ?? ""}`}
    >
      <div className={styles.topBar}>
        <div className={styles.dots}>
          <span className={styles.redDot}></span>
          <span className={styles.dot}></span>
          <span className={styles.greenDot}></span>
        </div>
        <span className={styles.barTitle}>{barTitle}</span>
        {barAside ? (
          <div className={styles.barAside}>{barAside}</div>
        ) : (
          <div className={styles.spacer}></div>
        )}
      </div>
      {mobileCollapsible ? (
        <>
          <div className={styles.desktopContent}>
            <div className={styles.contentInner}>
              {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
              <div className={styles.text}>{children}</div>
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
                {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
              </summary>
              <div className={styles.text}>{children}</div>
            </details>
            {callToAction ? (
              <a className={`${styles.link} ${styles.desktopLink}`} href="#">
                Lue lisää
              </a>
            ) : null}
          </div>
        </>
      ) : (
        <div className={styles.alwaysVisible}>
          <div className={styles.contentInner}>
            {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
            <div className={styles.text}>{children}</div>
          </div>
          {callToAction ? (
            <a className={`${styles.link} ${styles.desktopLink}`} href="#">
              Lue lisää
            </a>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default Terminal
