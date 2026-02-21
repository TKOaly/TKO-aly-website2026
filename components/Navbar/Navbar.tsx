"use client"

import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { ClientLink, useTranslation } from "@/app/i18n/client"
import styles from "./Navbar.module.css"

const navItems = [
  {
    labelKey: "nav.sections.association",
    links: [
      { href: "/hallitus", labelKey: "nav.links.board" },
      { href: "/tiedotus", labelKey: "nav.links.communications" },
      { href: "/saannot", labelKey: "nav.links.rules" },
      { href: "/talous", labelKey: "nav.links.finances" },
      { href: "/tunnukset", labelKey: "nav.links.credentials" },
      { href: "/vaalijarjestys", labelKey: "nav.links.electionOrder" },
      { href: "/tilinumerot", labelKey: "nav.links.accountNumbers" },
      { href: "/yhteystiedot", labelKey: "nav.links.contact" },
      { href: "/brandiohje", labelKey: "nav.links.brandGuide" },
      {
        href: "https://arkisto.tko-aly.fi/",
        labelKey: "nav.links.archive",
        external: true,
      },
      {
        href: "https://bbat.tko-aly.fi/",
        labelKey: "nav.links.debtsPayments",
        external: true,
      },
    ],
  },
  {
    labelKey: "nav.sections.activities",
    links: [
      { href: "/edunvalvonta", labelKey: "nav.links.advocacy" },
      { href: "/sitsit", labelKey: "nav.links.sitsit" },
      { href: "/vuosijuhlat", labelKey: "nav.links.annualParty" },
      { href: "/liikunta", labelKey: "nav.links.sports" },
      { href: "/ruokavalitys", labelKey: "nav.links.foodDelivery" },
      { href: "/README", labelKey: "nav.links.readme" },
      {
        href: "https://blog.tko-aly.fi/",
        labelKey: "nav.links.blog",
        external: true,
      },
    ],
  },
  {
    labelKey: "nav.sections.events",
    links: [
      { href: "/kalenteri", labelKey: "nav.links.calendar" },
      { href: "/lisaa-tapahtuma", labelKey: "nav.links.addEvent" },
    ],
  },
  {
    labelKey: "nav.sections.safety",
    links: [
      { href: "/hairinta", labelKey: "nav.links.harassment" },
      {
        href: "https://www.tko-aly.fi/attachments/files/399/Yhdenvertaisuussuunnitelma_2024.pdf?1715249780",
        labelKey: "nav.links.equality",
        external: true,
      },
      { href: "/tietosuoja", labelKey: "nav.links.privacyPolicy" },
    ],
  },
  {
    labelKey: "nav.sections.forFreshmen",
    links: [
      {
        href: "https://fuksiwiki.tko-aly.fi/Fuksiwiki",
        labelKey: "nav.links.fuksiwiki",
        external: true,
      },
      { href: "/fuksi-info", labelKey: "nav.links.fuksiInfo" },
      {
        href: "https://passi.tko-aly.fi/",
        labelKey: "nav.links.fuksiPassi",
        external: true,
      },
    ],
  },
  {
    labelKey: "nav.sections.companies",
    links: [
      {
        href: "https://jobs.tko-aly.fi/en/list/open",
        labelKey: "nav.links.jobs",
        external: true,
      },
      { href: "/yrityksille", labelKey: "nav.links.forCompanies" },
    ],
  },
]

const ExternalIcon = () => (
  <Image src="/external-url-10.png" alt="↗" width={10} height={10} />
)

function Navbar() {
  const { data: session } = useSession()
  const { t, lang } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const toggleLanguage = () => {
    const newLanguage = lang === "fi" ? "en" : "fi"
    const newPath = pathname.replace(`/${lang}`, `/${newLanguage}`)
    document.cookie = `tekis-language=${newLanguage}; path=/`
    router.push(newPath)
  }

  const otherLangLabel =
    lang === "fi" ? t("common.switchToEnglish") : t("common.switchToFinnish")

  return (
    <nav className={styles.navbar}>
      <ClientLink href="/">
        <Image
          src="/logo-yellow-on-black.png"
          width={48}
          height={48}
          alt="TKO-aly logo"
        />
      </ClientLink>
      <ul className={styles.nav}>
        {navItems.map(section => (
          <li
            key={section.labelKey}
            className={`${styles.navItem} ${styles.dropdown}`}
          >
            <button
              className={styles.dropdownToggle}
              aria-haspopup="true"
              aria-expanded="true"
            >
              {t(section.labelKey)} ▼
            </button>
            <ul className={styles.dropdownMenu} role="menu">
              {section.links.map(link => (
                <li key={link.href} role="none">
                  <ClientLink
                    role="menuitem"
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {t(link.labelKey)} {link.external && <ExternalIcon />}
                  </ClientLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div>
        <button className={styles.dropdownToggle} onClick={toggleLanguage}>
          {otherLangLabel}
        </button>
        {session ? (
          <button className={styles.dropdownToggle} onClick={() => signOut()}>
            {t("auth.signOut")}
          </button>
        ) : (
          <button
            className={styles.dropdownToggle}
            onClick={() => signIn("tkoaly")}
          >
            {t("auth.signIn")}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
