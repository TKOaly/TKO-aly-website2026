"use client"

import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ExternalLink, Globe, User } from "lucide-react"

import { ClientLink } from "@/app/i18n/client"
import { useMatchMediaQuery } from "@/lib/useMatchMediaQuery"
import { useToggleLanguage } from "@/lib/useToggleLanguage"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"

import MobileNavbar from "./MobileNavbar"
import styles from "./Navbar.module.css"

type Lang = "fi" | "en"

export interface NavLink {
  href: string
  labels: Record<string, string>
  external?: boolean
}

export interface NavSection {
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

export const userNavItems: NavLink[] = [
  {
    href: "/u/muokkaa",
    labels: { fi: "Muokkaa profiilia", en: "Edit profile" },
  },
  { href: "/u/jasenmaksu", labels: { fi: "Jäsenlasku", en: "Member invoice" } },
]

export const adminNavItems: NavLink[] = [
  {
    href: "/a/navigaatio",
    labels: { fi: "Sivun hallinta", en: "Administration" },
  },
]

function sectionKey(section: NavSection) {
  return (section.labels.fi || section.labels.en)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
}

function Navbar({ items }: { items: NavSection[] }) {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as Lang) || "fi"
  const isMobileView = useMatchMediaQuery("lg")
  const toggleLanguage = useToggleLanguage(lang)

  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isAtBottom =
        window.innerHeight + currentScrollY >= document.body.scrollHeight - 10

      if (isAtBottom) {
        setHidden(false)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const t = (key: string) => translations[lang][key] || key

  const otherLangLabel =
    lang === "fi" ? t("switchToEnglish") : t("switchToFinnish")

  return (
    <nav className={`${styles.navbar} ${hidden ? styles.hidden : ""}`}>
      <ClientLink href="/" className={styles.logoLink}>
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
            {items.map(section => (
              <li
                key={section.labels.fi || section.labels.en}
                className={styles.navItem}
              >
                <button
                  className={styles.dropdownToggle}
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {section.labels[lang]} ▼
                </button>
                <div
                  className={styles.megaMenu}
                  data-section={sectionKey(section)}
                  role="menu"
                >
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
                type="button"
                className={`${styles.dropdownToggle} ${styles.langButton}`}
                onClick={toggleLanguage}
              >
                <Globe size={18} aria-hidden />
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
                  {session?.user &&
                    (session.user as { admin?: boolean })?.admin &&
                    adminNavItems.map(item => (
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

      {isMobileView && (
        <div className={styles.mobileSlot}>
          <MobileNavbar items={items} />
        </div>
      )}
    </nav>
  )
}

export default Navbar
