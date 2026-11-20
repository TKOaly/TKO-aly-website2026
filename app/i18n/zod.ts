"use client"
import i18next from "i18next"
import * as z from "zod"

function syncZod(lng?: string) {
  z.config(lng?.split("-")[0] === "fi" ? z.locales.fi() : z.locales.en())
}

export function initZodI18n() {
  syncZod(i18next.language)
  i18next.on("languageChanged", syncZod)
}
