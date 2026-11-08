import type { ReactNode } from "react"
import styles from "./Card.module.css"

const Card = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={`${styles.card} ${className ?? ""}`}>{children}</div>
}

export default Card
