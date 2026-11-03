"use client"

import { useRouter } from "next/navigation"
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
  const router = useRouter()

  // The reset button's default action clears the form; then leave the page.
  const handleReset = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className={styles.bottomBar}>
      <div className={styles.bottomBarInner}>
        <button
          type="reset"
          form={form}
          className={styles.resetButton}
          onClick={handleReset}
        >
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
