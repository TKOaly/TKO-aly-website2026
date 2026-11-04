"use client"

import Image from "next/image"

import goose from "@/app/assets/goose.svg"
import { ClientLink, useTranslation } from "@/app/i18n/client"

import styles from "./not-found.module.css"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main id="main-content" className={styles.notFound}>
      <Image
        className={styles.goose}
        src={goose}
        alt={t("notFound.alt")}
        priority
      />
      <div className={styles.text}>
        <p className={styles.code}>{t("notFound.title")}</p>
        <h1>{t("notFound.heading")}</h1>
        <p>{t("notFound.text")}</p>
        <ClientLink href="/" className="btn">
          {t("notFound.home")}
        </ClientLink>
      </div>
    </main>
  )
}
