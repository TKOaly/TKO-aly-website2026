import enTranslations from "@/locales/en.json"
import fiTranslations from "@/locales/fi.json"
import { InitOptions } from "i18next"

export const cookieName = "tekis-lang"
export const languages = ["en", "fi"]
export const fallbackLang = "fi"

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
