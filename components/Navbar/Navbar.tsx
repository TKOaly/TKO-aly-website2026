"use client"

import Image from "next/image"
import { useRef } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { ClientLink, useTranslation } from "@/app/i18n/client"
import styles from "./Navbar.module.css"
import { useMatchMediaQuery } from "@/lib/useMatchMediaQuery"
import { HamburgerIcon, X, ExternalLink } from "lucide-react"

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

function Navbar() {
  const { data: session } = useSession()
  const { t, lang } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const isMobileView = useMatchMediaQuery()
  const mobileMenuRef = useRef<HTMLDialogElement>(null)

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

      {!isMobileView && (
        <>
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
                        {t(link.labelKey)}{" "}
                        {link.external && (
                          <ExternalLink height={16} width={16} />
                        )}
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
              <button
                className={styles.dropdownToggle}
                onClick={() => signOut()}
              >
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
        </>
      )}

      {isMobileView && (
        <>
          <button
            type="button"
            onClick={() => mobileMenuRef.current?.showModal()}
            className={styles.hamburger}
            aria-label={t("nav.openMenu")}
          >
            <HamburgerIcon height={28} width={28} />
          </button>

          <dialog ref={mobileMenuRef} className={styles.mobileDialog}>
            <button
              type="button"
              className={styles.mobileCloseButton}
              onClick={() => mobileMenuRef.current?.close()}
              aria-label={t("nav.closeMenu")}
            >
              <X height={28} width={28} />
            </button>
            <nav className={styles.mobileNav}>
              {navItems.map((section, i) => (
                <section key={section.labelKey}>
                  <details open={i === 0}>
                    <summary className={styles.mobileSectionHeading}>
                      {t(section.labelKey)}
                    </summary>
                    <ul className={styles.mobileLinkList}>
                      {section.links.map(link => (
                        <li key={link.href}>
                          <ClientLink
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={
                              link.external ? "noopener noreferrer" : undefined
                            }
                            onClick={() => mobileMenuRef.current?.close()}
                            className={styles.mobileLink}
                          >
                            {t(link.labelKey)}
                            {link.external && (
                              <>
                                {" "}
                                <ExternalLink height={16} width={16} />
                              </>
                            )}
                          </ClientLink>
                        </li>
                      ))}
                    </ul>
                  </details>
                </section>
              ))}
            </nav>

            <div className={styles.mobileDialogFooter}>
              <button
                className={styles.mobileActionButton}
                onClick={toggleLanguage}
              >
                {otherLangLabel}
              </button>
              {session ? (
                <button
                  className={styles.mobileActionButton}
                  onClick={() => {
                    mobileMenuRef.current?.close()
                    signOut()
                  }}
                >
                  {t("auth.signOut")}
                </button>
              ) : (
                <button
                  className={styles.mobileActionButton}
                  onClick={() => {
                    mobileMenuRef.current?.close()
                    signIn("tkoaly")
                  }}
                >
                  {t("auth.signIn")}
                </button>
              )}
            </div>
          </dialog>
        </>
      )}
    </nav>
  )
}

export default Navbar
