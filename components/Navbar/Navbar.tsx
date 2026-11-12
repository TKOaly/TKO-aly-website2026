"use client"

import Image, { type StaticImageData } from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ExternalLink, Globe, User } from "lucide-react"

import { ClientLink } from "@/app/i18n/client"
import { useMatchMediaQuery } from "@/lib/useMatchMediaQuery"
import { useToggleLanguage } from "@/lib/useToggleLanguage"
import { useParams, usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"

import fuksiDuck from "@/app/assets/fuksi-duck.svg"
import neko from "@/app/assets/neko.svg"
import orangeCat from "@/app/assets/orange-cat.svg"
import aviatorDuck from "@/app/assets/aviator-duck.svg"
import runningMan from "@/app/assets/running-man.svg"
import sittingDuck from "@/app/assets/sitting-duck.svg"

import MobileNavbar from "./MobileNavbar"
import styles from "./Navbar.module.css"
import { isLoginEnabled } from "@/lib/featureFlags"

type Lang = "fi" | "en"

/** Scroll distance (px) over which the desktop logo shrinks to half size. */
const LOGO_SHRINK_DISTANCE = 96

// Decorative mascot and tile colour for each mega menu, keyed by sectionKey().
const sectionImages: Record<
  string,
  {
    image: StaticImageData
    bg?: string
    flush?: boolean
    corner?: boolean
  }
> = {
  yhdistys: { image: fuksiDuck, bg: "hsl(200 90% 72%)" },
  toiminta: { image: orangeCat, bg: "hsl(40 50% 80%)" },
  tapahtumat: {
    image: runningMan,
    bg: "hsl(140 55% 72%)",
    flush: true,
  },
  turvallisuus: {
    image: aviatorDuck,
    bg: "hsl(200 90% 72%)",
    corner: true,
  },
  fukseille: { image: sittingDuck },
  yritykset: { image: neko, bg: "hsl(310 80% 65%)" },
}

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
    signOut: "Kirjaudu ulos",
    signIn: "Kirjaudu",
    openMenu: "Avaa valikko",
    opensInNewWindow: "avautuu uuteen ikkunaan",
    switchToEnglishLabel: "Vaihda sivuston kieli englanniksi",
    switchToFinnishLabel: "Vaihda sivuston kieli suomeksi",
  },
  en: {
    signOut: "Sign out",
    signIn: "Sign in",
    openMenu: "Open menu",
    opensInNewWindow: "opens in a new window",
    switchToEnglishLabel: "Switch the site language to English",
    switchToFinnishLabel: "Switch the site language to Finnish",
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

/** Path without the language prefix, e.g. "/fi/hallitus" -> "/hallitus". */
export function pathWithoutLang(pathname: string | null) {
  return "/" + (pathname ?? "").split("/").slice(2).join("/").replace(/\/$/, "")
}

export const isActiveLink = (link: NavLink, path: string) =>
  !link.external && link.href === path

export const isActiveSection = (section: NavSection, path: string) =>
  section.links.some(link => isActiveLink(link, path))

function sectionKey(section: NavSection) {
  return (section.labels.fi || section.labels.en)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
}

function Navbar({
  items,
  disabledRoutes = [],
}: {
  items: NavSection[]
  disabledRoutes?: string[]
}) {
  const { data: session, status } = useSession()
  const params = useParams()
  const lang = (params?.lang as Lang) || "fi"
  const path = pathWithoutLang(usePathname())
  const isMobileView = useMatchMediaQuery("lg")
  const toggleLanguage = useToggleLanguage(lang)

  const [hidden, setHidden] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const toggleRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    // The desktop logo shrinks linearly from x1 at the top to x0.5 after
    // LOGO_SHRINK_DISTANCE px of scrolling (see .logo in Navbar.module.css).
    const updateLogoScale = () => {
      const progress = Math.min(
        Math.max(window.scrollY, 0) / LOGO_SHRINK_DISTANCE,
        1,
      )
      navRef.current?.style.setProperty(
        "--logo-scale",
        String(1 - progress / 2),
      )
    }

    const handleScroll = () => {
      updateLogoScale()
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

    updateLogoScale()
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
    const frame = requestAnimationFrame(() => setOpenId(null))
    return () => cancelAnimationFrame(frame)
  }, [isMobileView])

  const t = (key: string) => translations[lang][key] || key

  const otherLangCode = lang === "fi" ? "EN" : "FI"
  const otherLangAriaLabel =
    lang === "fi" ? t("switchToEnglishLabel") : t("switchToFinnishLabel")

  const userMenuId = "navbar-menu-user"
  const megaOpen = openId !== null && openId !== "user"

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${hidden ? styles.hidden : ""}`}
    >
      <ClientLink href="/" className={styles.logoLink}>
        <Image
          src="/logo-yellow-on-black.png"
          className={styles.logo}
          width={256}
          height={256}
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
              const panelId = `navbar-menu-${id}`
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
                    className={`${styles.dropdownToggle} ${isActiveSection(section, path) ? styles.activeSection : ""}`}
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
                      {sectionImages[id] && (
                        <div
                          className={`${styles.megaMenuImage} ${sectionImages[id].flush ? styles.megaMenuImageFlush : ""} ${sectionImages[id].corner ? styles.megaMenuImageCorner : ""}`}
                          style={
                            {
                              "--tile-bg": sectionImages[id].bg,
                            } as React.CSSProperties
                          }
                        >
                          <Image src={sectionImages[id].image} alt="" />
                        </div>
                      )}
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
                              aria-current={
                                isActiveLink(link, path) ? "page" : undefined
                              }
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
                                  <span className="srOnly">
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

          <ul
            className={`${styles.secondaryActionList} ${status === "loading" ? styles.authLoading : ""}`}
          >
            <li>
              <button
                type="button"
                className={`${styles.dropdownToggle} ${styles.langButton}`}
                aria-label={otherLangAriaLabel}
                onClick={toggleLanguage}
              >
                <Globe size={18} aria-hidden />
                {otherLangCode}
              </button>
            </li>
            {isLoginEnabled() &&
              (session ? (
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
                    {userNavItems
                      .filter(item => !disabledRoutes.includes(item.href))
                      .map(item => (
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
                    className={styles.signInButton}
                    onClick={() => signIn("tkoaly")}
                  >
                    {t("signIn")}
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}

      {isMobileView && (
        <div className={styles.mobileSlot}>
          <MobileNavbar items={items} disabledRoutes={disabledRoutes} />
        </div>
      )}
    </nav>
  )
}

export default Navbar
