import { ComponentProps, forwardRef } from "react"
import { createInstance } from "i18next"
import { initReactI18next } from "react-i18next/initReactI18next"
import { getOptions } from "@/app/i18n/settings"
import NextLink from "next/link"

const initI18next = async () => {
  const i18nInstance = createInstance()

  await i18nInstance.use(initReactI18next).init(getOptions())

  return i18nInstance
}

export async function getAsyncTranslation(lng: string) {
  const i18nextInstance = await initI18next()

  return {
    t: i18nextInstance.getFixedT(lng, "translations"),
    i18n: i18nextInstance,
  }
}

export const ServerLink: React.FC<
  ComponentProps<typeof NextLink> & { lang: string }
> = forwardRef(function Link(props, ref) {
  return <NextLink {...props} href={`/${props.lang}${props.href}`} ref={ref} />
})
