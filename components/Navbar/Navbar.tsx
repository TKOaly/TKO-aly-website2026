"use client"

import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ExternalLink, User } from "lucide-react"

import { ClientLink } from "@/app/i18n/client"
import { useMatchMediaQuery } from "@/lib/useMatchMediaQuery"
import { useToggleLanguage } from "@/lib/useToggleLanguage"
import { useParams } from "next/navigation"

import MobileNavbar from "./MobileNavbar"
import styles from "./Navbar.module.css"

type Lang = "fi" | "en"

interface NavLink {
  href: string
  labels: Record<string, string>
  external?: boolean
}

interface NavSection {
  labels: Record<string, string>
  descriptions: Record<string, string>
  links: NavLink[]
}

const translations: Record<Lang, Record<string, string>> = {
  fi: {
    switchToEnglish: "In English",
    switchToFinnish: "Suomeksi",
    signOut: "Kirjaudu ulos",
    signIn: "Kirjaudu sisään",
    openMenu: "Avaa valikko",
  },
  en: {
    switchToEnglish: "In English",
    switchToFinnish: "Suomeksi",
    signOut: "Sign out",
    signIn: "Sign in",
    openMenu: "Open menu",
  },
}

const userNavItems = [
  {
    href: "/u/muokkaa",
    labels: { fi: "Muokkaa profiilia", en: "Edit profile" },
  },
  { href: "/u/jasenmaksu", labels: { fi: "Jäsenlasku", en: "Member invoice" } },
]

function Navbar({ items }: { items: NavSection[] }) {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as Lang) || "fi"
  const isMobileView = useMatchMediaQuery("lg")
  const toggleLanguage = useToggleLanguage(lang)

  const t = (key: string) => translations[lang][key] || key

  const otherLangLabel =
    lang === "fi" ? t("switchToEnglish") : t("switchToFinnish")

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
          <div className={styles.megaMenuBackdrop} aria-hidden="true" />
          <ul className={styles.primaryList}>
            {items.map((section, idx) => (
              <li key={idx} className={styles.navItem}>
                <button
                  className={styles.dropdownToggle}
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {section.labels[lang]} ▼
                </button>
                <div className={styles.megaMenu} role="menu">
                  <div className={styles.megaMenuInner}>
                    <div className={styles.megaMenuHeader}>
                      <h3 className={styles.megaMenuTitle}>
                        {section.labels[lang]}
                      </h3>
                      <p className={styles.megaMenuDescription}>
                        {section.descriptions[lang]}
                      </p>
                    </div>
                    <ul className={styles.megaMenuLinks}>
                      {section.links.map(link => (
                        <li key={link.href} role="none">
                          <ClientLink
                            role="menuitem"
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={
                              link.external ? "noopener noreferrer" : undefined
                            }
                          >
                            {link.labels[lang]}{" "}
                            {link.external && (
                              <ExternalLink height={16} width={16} />
                            )}
                          </ClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <ul className={styles.secondaryActionList}>
            <li>
              <button
                className={styles.dropdownToggle}
                onClick={toggleLanguage}
              >
                {otherLangLabel}
              </button>
            </li>
            {session ? (
              <li className={styles.navItem}>
                <button
                  type="button"
                  title={t("openMenu")}
                  className={styles.whiteButton}
                  aria-haspopup="true"
                >
                  <User height={24} width={24} />
                </button>
                <ul className={styles.dropdownMenu} role="menu">
                  {userNavItems.map(item => (
                    <li key={item.href} role="none">
                      <ClientLink role="menuitem" href={item.href}>
                        {item.labels[lang]}
                      </ClientLink>
                    </li>
                  ))}
                  <li role="none">
                    <ClientLink
                      role="menuitem"
                      href="#"
                      onClick={() => signOut()}
                    >
                      {t("signOut")}
                    </ClientLink>
                  </li>
                </ul>
              </li>
            ) : (
              <li>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => signIn("tkoaly")}
                >
                  {t("signIn")}
                </button>
              </li>
            )}
          </ul>
        </>
      )}

      {isMobileView && <MobileNavbar />}
    </nav>
  )
}

export default Navbar
