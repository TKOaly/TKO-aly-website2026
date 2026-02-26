import enTranslations from "@/locales/en.json"
import fiTranslations from "@/locales/fi.json"
import { InitOptions } from "i18next"
import { cookieName, fallbackLang, languages } from "./config"

export { cookieName, fallbackLang, languages }

const runsOnServerSide = typeof window === "undefined"

export const getOptions = (): InitOptions => ({
  showSupportNotice: false,
  supportedLngs: languages,
  fallbackLng: fallbackLang,
  preload: runsOnServerSide ? languages : [],
  resources: {
    fi: { translations: fiTranslations },
    en: { translations: enTranslations },
  },
})
