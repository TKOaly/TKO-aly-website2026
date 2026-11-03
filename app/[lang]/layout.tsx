import type { Metadata } from "next"
import { League_Gothic } from "next/font/google"
import { getServerSession } from "next-auth/next"

import { config as authOptions } from "@/auth"
import Providers from "@/components/Providers"
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
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={headingFont.variable}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ lang: "fi" }, { lang: "en" }]
}
