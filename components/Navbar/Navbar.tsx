"use client"

import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ExternalLink, User } from "lucide-react"

import { ClientLink, useTranslation } from "@/app/i18n/client"
import { useMatchMediaQuery } from "@/lib/useMatchMediaQuery"
import { useToggleLanguage } from "@/lib/useToggleLanguage"

import MobileNavbar from "./MobileNavbar"
import { navItems, userNavItems } from "./constant"
import styles from "./Navbar.module.css"

function Navbar() {
  const { data: session } = useSession()
  const { t, lang } = useTranslation()
  const isMobileView = useMatchMediaQuery("lg")
  const toggleLanguage = useToggleLanguage(lang)

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
          <ul className={styles.primaryList}>
            {navItems.map(section => (
              <li key={section.labelKey} className={styles.navItem}>
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
                  title={t("nav.openMenu")}
                  className={styles.whiteButton}
                  aria-haspopup="true"
                >
                  <User height={24} width={24} />
                </button>
                <ul
                  className={`${styles.dropdownMenu} ${styles.userDropdownMenu}`}
                  role="menu"
                >
                  {userNavItems.map(item => (
                    <li key={item.href} role="none">
                      <ClientLink role="menuitem" href={item.href}>
                        {t(item.labelKey)}
                      </ClientLink>
                    </li>
                  ))}
                  <li role="none">
                    <ClientLink
                      role="menuitem"
                      href="#"
                      onClick={() => signOut()}
                    >
                      {t("auth.signOut")}
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
                  {t("auth.signIn")}
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
