"use client"

import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ExternalLink, Globe, User } from "lucide-react"

import { ClientLink } from "@/app/i18n/client"
import { useMatchMediaQuery } from "@/lib/useMatchMediaQuery"
import { useToggleLanguage } from "@/lib/useToggleLanguage"
import { useParams } from "next/navigation"
import { useState, useEffect, useRef, useId } from "react"

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
    opensInNewWindow: "avautuu uuteen ikkunaan",
  },
  en: {
    switchToEnglish: "In English",
    switchToFinnish: "Suomeksi",
    signOut: "Sign out",
    signIn: "Sign in",
    openMenu: "Open menu",
    opensInNewWindow: "opens in a new window",
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
  const baseId = useId()

  const [hidden, setHidden] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const toggleRefs = useRef<Record<string, HTMLButtonElement | null>>({})

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || openId === null) return
      const id = openId
      setOpenId(null)
      toggleRefs.current[id]?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenId(null)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [openId])

  useEffect(() => {
    setOpenId(null)
  }, [isMobileView])

  const t = (key: string) => translations[lang][key] || key

  const otherLangLabel =
    lang === "fi" ? t("switchToEnglish") : t("switchToFinnish")

  const userMenuId = `${baseId}-user`
  const megaOpen = openId !== null && openId !== "user"

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${hidden ? styles.hidden : ""}`}
    >
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
          <div
            className={`${styles.megaMenuBackdrop} ${megaOpen ? styles.megaMenuBackdropVisible : ""}`}
            aria-hidden="true"
          />
          <ul className={styles.primaryList}>
            {items.map(section => {
              const id = sectionKey(section)
              const panelId = `${baseId}-${id}`
              const isOpen = openId === id
              return (
                <li
                  key={id}
                  className={`${styles.navItem} ${isOpen ? styles.open : ""}`}
                  onMouseEnter={() => setOpenId(id)}
                  onMouseLeave={() =>
                    setOpenId(current => (current === id ? null : current))
                  }
                >
                  <button
                    type="button"
                    className={styles.dropdownToggle}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    ref={el => {
                      toggleRefs.current[id] = el
                    }}
                    onClick={() =>
                      setOpenId(current => (current === id ? null : id))
                    }
                  >
                    {section.labels[lang]} ▼
                  </button>
                  <div
                    id={panelId}
                    className={`${styles.megaMenu} ${isOpen ? styles.megaMenuOpen : ""}`}
                    data-section={id}
                    hidden={!isOpen}
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
                          <li key={link.href}>
                            <ClientLink
                              href={link.href}
                              target={link.external ? "_blank" : undefined}
                              rel={
                                link.external
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              onClick={() => setOpenId(null)}
                            >
                              {link.labels[lang]}
                              {link.external && (
                                <>
                                  {" "}
                                  <ExternalLink
                                    height={16}
                                    width={16}
                                    aria-hidden
                                  />
                                  <span className={styles.srOnly}>
                                    ({t("opensInNewWindow")})
                                  </span>
                                </>
                              )}
                            </ClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              )
            })}
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
              <li
                className={`${styles.navItem} ${openId === "user" ? styles.open : ""}`}
                onMouseEnter={() => setOpenId("user")}
                onMouseLeave={() =>
                  setOpenId(current => (current === "user" ? null : current))
                }
              >
                <button
                  type="button"
                  title={t("openMenu")}
                  className={styles.whiteButton}
                  aria-expanded={openId === "user"}
                  aria-controls={userMenuId}
                  aria-haspopup="true"
                  ref={el => {
                    toggleRefs.current.user = el
                  }}
                  onClick={() =>
                    setOpenId(current => (current === "user" ? null : "user"))
                  }
                >
                  <User height={24} width={24} />
                </button>
                <ul
                  id={userMenuId}
                  className={`${styles.dropdownMenu} ${openId === "user" ? styles.dropdownMenuOpen : ""}`}
                  hidden={openId !== "user"}
                >
                  {userNavItems.map(item => (
                    <li key={item.href}>
                      <ClientLink
                        href={item.href}
                        onClick={() => setOpenId(null)}
                      >
                        {item.labels[lang]}
                      </ClientLink>
                    </li>
                  ))}
                  {session?.user &&
                    (session.user as { admin?: boolean })?.admin &&
                    adminNavItems.map(item => (
                      <li key={item.href}>
                        <ClientLink
                          href={item.href}
                          onClick={() => setOpenId(null)}
                        >
                          {item.labels[lang]}
                        </ClientLink>
                      </li>
                    ))}
                  <li>
                    <ClientLink
                      href="#"
                      onClick={() => {
                        setOpenId(null)
                        signOut()
                      }}
                    >
                      {t("signOut")}
                    </ClientLink>
                  </li>
                </ul>
              </li>
            ) : (
              <li>
                <button
                  type="button"
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
