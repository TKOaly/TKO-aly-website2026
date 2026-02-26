import type { InputHTMLAttributes } from "react"
import styles from "./Field.module.css"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  hint?: string
}

const Field = ({ id, label, hint, name, ...inputProps }: Props) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={id}>
        {label} {inputProps.required ? "*" : ""}
      </label>
      <input
        {...inputProps}
        id={id}
        name={name ?? id} // Fallback to id
        className={styles.input}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

export default Field
