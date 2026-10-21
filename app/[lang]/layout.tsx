import Providers from "@/components/Providers"
import type { Metadata } from "next"
import "../globals.css"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ lang: "fi" }, { lang: "en" }]
}
