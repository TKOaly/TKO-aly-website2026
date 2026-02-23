import type { ReactNode } from "react"
import styles from "./Fieldset.module.css"

interface Props {
  legend: string
  children: ReactNode
}
const Fieldset = ({ legend, children }: Props) => {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      {children}
    </fieldset>
  )
}

export default Fieldset
