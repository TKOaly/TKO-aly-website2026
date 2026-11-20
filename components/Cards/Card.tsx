import type { ReactNode } from "react"
import styles from "./Card.module.css"

const Card = ({
  children,
  className,
  wide = false,
}: {
  children: ReactNode
  className?: string
  /** Remove the max-width limits, so the card fills its container. */
  wide?: boolean
}) => {
  return (
    <div
      className={`${styles.card} ${wide ? styles.wide : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

export default Card
