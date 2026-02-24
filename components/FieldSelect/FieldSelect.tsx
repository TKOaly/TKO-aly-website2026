import type { SelectHTMLAttributes, ReactNode } from "react"
import styles from "./FieldSelect.module.css"

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  children: ReactNode
}

const FieldSelect = ({ id, label, children, ...selectProps }: Props) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={id}>
        {label} {selectProps.required ? "*" : ""}
      </label>
      <select
        id={id}
        name={selectProps.name ?? id}
        className={styles.select}
        {...selectProps}
      >
        {children}
      </select>
    </div>
  )
}

export default FieldSelect
