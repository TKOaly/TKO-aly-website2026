import type { InputHTMLAttributes } from "react"
import styles from "./Field.module.css"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  hint?: string
}

const Field = ({ id, label, hint, ...inputProps }: Props) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={id}>
        {label} {inputProps.required ? "*" : ""}
      </label>
      <input
        id={id}
        name={inputProps.name ?? id} // Fallback to id
        className={styles.input}
        {...inputProps}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

export default Field
