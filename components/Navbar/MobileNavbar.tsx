import { useRef } from "react"
import { ExternalLink, Globe, Menu, X } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"

import { ClientLink, useTranslation } from "@/app/i18n/client"
import { useToggleLanguage } from "@/lib/useToggleLanguage"

import styles from "./MobileNavbar.module.css"
import { NavSection, userNavItems, adminNavItems } from "./Navbar"

interface MobileNavbarProps {
  items: NavSection[]
}

const MobileNavbar = ({ items }: MobileNavbarProps) => {
  const mobileMenuRef = useRef<HTMLDialogElement>(null)
  const { data: session } = useSession()
  const { t, lang: language } = useTranslation()
  const lang = (language as string) || "fi"
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
        <Menu height={28} width={28} />
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
          {items.map(section => (
            <section key={section.labels.fi || section.labels.en}>
              <details>
                <summary className={styles.mobileSectionHeading}>
                  {section.labels[lang]}
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
                        {link.labels[lang]}
                        {link.external && (
                          <>
                            {" "}
                            <ExternalLink height={16} width={16} aria-hidden />
                            <span className={styles.srOnly}>
                              ({t("common.opensInNewWindow")})
                            </span>
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
                  {item.labels[lang]}
                </ClientLink>
              ))}
              {session?.user &&
                (session.user as { admin?: boolean })?.admin &&
                adminNavItems.map(item => (
                  <ClientLink
                    key={item.href}
                    href={item.href}
                    className={styles.mobileLink}
                    onClick={() => mobileMenuRef.current?.close()}
                  >
                    {item.labels[lang]}
                  </ClientLink>
                ))}
            </section>
          )}
        </nav>

        <section className={styles.mobileDialogFooter}>
          <button
            type="button"
            className={styles.mobileActionButton}
            onClick={toggleLanguage}
          >
            <Globe size={18} aria-hidden />
            {otherLangLabel}
          </button>
          {session ? (
            <button
              type="button"
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
              type="button"
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
