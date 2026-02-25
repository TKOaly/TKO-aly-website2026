import { useRef } from "react"
import { ExternalLink, HamburgerIcon, X } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"

import { ClientLink, useTranslation } from "@/app/i18n/client"
import { useToggleLanguage } from "@/lib/useToggleLanguage"

import styles from "./MobileNavbar.module.css"
import { navItems, userNavItems } from "./constant"

const MobileNavbar = () => {
  const mobileMenuRef = useRef<HTMLDialogElement>(null)
  const { data: session } = useSession()
  const { t, lang } = useTranslation()
  const toggleLanguage = useToggleLanguage(lang)
  const otherLangLabel = lang === "fi" ? "In English" : "Suomeksi"

  return (
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
          {navItems.map(section => (
            <section key={section.labelKey}>
              <details>
                <summary className={styles.mobileSectionHeading}>
                  {t(section.labelKey)}
                </summary>
                <ul className={styles.mobileLinkList}>
                  {section.links.map(link => (
                    <li key={link.href}>
                      <ClientLink
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
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

          {session && (
            <section>
              {userNavItems.map(item => (
                <ClientLink
                  key={item.href}
                  href={item.href}
                  className={styles.mobileLink}
                  onClick={() => mobileMenuRef.current?.close()}
                >
                  {t(item.labelKey)}
                </ClientLink>
              ))}
            </section>
          )}
        </nav>

        <section className={styles.mobileDialogFooter}>
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
        </section>
      </dialog>
    </>
  )
}

export default MobileNavbar
