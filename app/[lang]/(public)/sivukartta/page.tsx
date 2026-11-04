import type { Metadata } from "next"

import PageHeader from "@/components/PageHeader/PageHeader"
import type { NavLink, NavSection } from "@/components/Navbar/Navbar"
import { ServerLink, getAsyncTranslation } from "@/app/i18n"
import { hiddenRoutes } from "@/lib/featureFlags"
import { getFooter } from "@/lib/footer"
import { getNavbar } from "@/lib/navbar"

import styles from "./Sivukartta.module.css"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)
  return { title: t("sitemap.title") }
}

export default async function Sivukartta({ params }: Props) {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)
  const hidden = hiddenRoutes()
  const opensInNewWindow = t("common.opensInNewWindow")

  const sections: NavSection[] = await getNavbar()
  const footerLinks: NavLink[] = await getFooter()

  const label = (link: NavLink) =>
    link.labels[lang] ?? link.labels.fi ?? link.href

  const renderLink = (link: NavLink) =>
    link.href.startsWith("http") || link.external ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {label(link)}
        <span className={styles.srOnly}> ({opensInNewWindow})</span>
      </a>
    ) : (
      <ServerLink lang={lang} href={link.href}>
        {label(link)}
      </ServerLink>
    )

  const visible = (links: NavLink[]) =>
    links.filter(link => !hidden.includes(link.href))

  return (
    <main id="main-content">
      <PageHeader
        title={t("sitemap.title")}
        description={t("sitemap.description")}
      />

      <div className={styles.grid}>
        <section aria-labelledby="sitemap-main">
          <h2 id="sitemap-main">{t("sitemap.main")}</h2>
          <ul className={styles.list}>
            <li>
              <ServerLink lang={lang} href="/">
                {t("sitemap.home")}
              </ServerLink>
            </li>
            <li>
              <ServerLink lang={lang} href="/kalenteri">
                {t("sitemap.calendar")}
              </ServerLink>
            </li>
          </ul>
        </section>

        {sections.map((section, index) => (
          <section
            key={section.labels.fi}
            aria-labelledby={`sitemap-section-${index}`}
          >
            <h2 id={`sitemap-section-${index}`}>
              {section.labels[lang] ?? section.labels.fi}
            </h2>
            <ul className={styles.list}>
              {visible(section.links).map(link => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
          </section>
        ))}

        {footerLinks.length > 0 && (
          <section aria-labelledby="sitemap-other">
            <h2 id="sitemap-other">{t("sitemap.other")}</h2>
            <ul className={styles.list}>
              {visible(footerLinks).map(link => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
