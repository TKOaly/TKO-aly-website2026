import type { ButtonHTMLAttributes, ReactNode } from "react"
import styles from "./CallToActionButton.module.css"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  form: string
  children: ReactNode
}

const MobileCallToActionButton = ({
  form,
  children,
  ...buttonProps
}: Props) => {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.bottomBarInner}>
        <button type="reset" form={form} className={styles.resetButton}>
          Eiku
        </button>
        <button
          {...buttonProps}
          form={form}
          type="submit"
          className={styles.submitButton}
        >
          {children}
        </button>
      </div>
    </div>
  )
}

export default MobileCallToActionButton
