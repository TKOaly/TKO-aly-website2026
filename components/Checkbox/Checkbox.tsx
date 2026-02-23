import type { InputHTMLAttributes, ReactNode } from "react"
import styles from "./Checkbox.module.css"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  children?: ReactNode
}

const Checkbox = ({ id, label, required, children, ...inputProps }: Props) => {
  return (
    <label className={styles.checkboxLabel}>
      <input
        {...inputProps}
        id={id}
        type="checkbox"
        required={required}
        name={inputProps.name ?? id}
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxText}>
        {children ?? label ?? id}
        {required ? " *" : ""}
      </span>
    </label>
  )
}

export default Checkbox
