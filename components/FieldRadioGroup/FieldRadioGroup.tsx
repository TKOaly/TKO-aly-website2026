import type { InputHTMLAttributes } from "react"
import styles from "./FieldRadioGroup.module.css"

interface RadioOption {
  value: string
  label: string
  defaultChecked?: boolean
}

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  legend: string
  name: string
  options: RadioOption[]
}

const FieldRadioGroup = ({ legend, name, options, ...inputProps }: Props) => {
  return (
    <fieldset className={styles.fieldGroup}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.radioGroup}>
        {options.map(option => (
          <label key={option.value} className={styles.radioLabel}>
            <input
              {...inputProps}
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.defaultChecked}
              className={styles.radioInput}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default FieldRadioGroup
