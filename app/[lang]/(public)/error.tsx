"use client"

import Image from "next/image"

import chasingGoose from "@/app/assets/chasing-goose.svg"
import { ClientLink, useTranslation } from "@/app/i18n/client"

import styles from "./not-found.module.css"

export default function ServerError({ reset }: { reset: () => void }) {
  const { t } = useTranslation()

  return (
    <main id="main-content" className={styles.notFound}>
      <Image
        className={styles.goose}
        src={chasingGoose}
        alt={t("serverError.alt")}
        priority
      />
      <div className={styles.text}>
        <p className={styles.code}>{t("serverError.title")}</p>
        <h1>{t("serverError.heading")}</h1>
        <p>{t("serverError.text")}</p>
        <div className={styles.actions}>
          <button type="button" className="btn" onClick={reset}>
            {t("serverError.retry")}
          </button>
          <ClientLink href="/" className="btn2">
            {t("serverError.home")}
          </ClientLink>
        </div>
      </div>
    </main>
  )
}
