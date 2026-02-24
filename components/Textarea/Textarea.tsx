import type { TextareaHTMLAttributes } from "react"
import styles from "./Textarea.module.css"

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  id: string
  hint?: string
}
const Textarea = ({ label, id, hint, ...rest }: Props) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={id}>
        {label} {rest.required ? "*" : ""}
      </label>
      <textarea
        {...rest}
        id={id}
        name={rest.name ?? id}
        required={rest.required || false}
        className={styles.textarea}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

export default Textarea
