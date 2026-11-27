"use client"

import { X } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useId, useRef } from "react"

import styles from "./Drawer.module.css"

/**
 * Bottom sheet built on <dialog>: focus trap, Esc and backdrop come for free.
 * Controlled through `open`; `onClose` fires for Esc, backdrop and the close
 * button, so the parent can reset its state.
 */
export default function Drawer({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  closeLabel: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return

    const desktop = window.matchMedia("(min-width: 1025px)")
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.close()
    }
    desktop.addEventListener("change", closeOnDesktop)

    document.documentElement.style.overflow = "hidden"
    if (!dialog.open) dialog.showModal()

    return () => {
      desktop.removeEventListener("change", closeOnDesktop)
      document.documentElement.style.overflow = ""
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={event => {
        // Close on a backdrop tap, or after following a link inside.
        const target = event.target as HTMLElement
        if (target === event.currentTarget || target.closest("a")) {
          ref.current?.close()
        }
      }}
    >
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button
          type="button"
          className={styles.close}
          onClick={() => ref.current?.close()}
          aria-label={closeLabel}
        >
          <X size={20} aria-hidden />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  )
}
