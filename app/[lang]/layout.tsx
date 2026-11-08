import type { Metadata } from "next"
import { League_Gothic } from "next/font/google"
import { getServerSession } from "next-auth/next"

import { config as authOptions } from "@/auth"
import Providers from "@/components/Providers"
import SkipLink from "@/components/SkipLink/SkipLink"
import { getAsyncTranslation } from "@/app/i18n"
import "../globals.css"

const headingFont = League_Gothic({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: { default: "TKO-äly", template: "%s | TKO-äly" },
  description:
    "TKO-äly ry on Helsingin yliopiston tietojenkäsittelytieteen ja datatieteen opiskelijoiden ainejärjestö, joka ajaa opiskelijoiden etua opintoasioissa ja järjestää moninaista vapaa-ajan toimintaa.",
  metadataBase: new URL("https://tko-aly.fi"),
  alternates: {
    canonical: "https://tko-aly.fi",
    languages: {
      "fi-FI": "https://tko-aly.fi/fi",
      "en-US": "https://tko-aly.fi/en",
    },
  },
  openGraph: {
    title: "TKO-äly",
    description:
      "TKO-äly ry on Helsingin yliopiston tietojenkäsittelytieteen ja datatieteen opiskelijoiden ainejärjestö, joka ajaa opiskelijoiden etua opintoasioissa ja järjestää moninaista vapaa-ajan toimintaa.",
    url: "https://tko-aly.fi",
    siteName: "TKO-äly",
    // images: [],
  },
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)
  const session = await getServerSession(authOptions)

  return (
    <html lang={lang}>
      <body className={headingFont.variable}>
        <SkipLink label={t("common.skipToContent")} />
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ lang: "fi" }, { lang: "en" }]
}
