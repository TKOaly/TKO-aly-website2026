"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import styles from "./Navbar.module.css"

const navItems = [
  {
    label: "Yhdistys",
    links: [
      { href: "/hallitus", label: "Hallitus" },
      { href: "/tiedotus", label: "Tiedotus" },
      { href: "/saannot", label: "Säännöt" },
      { href: "/talous", label: "Talous" },
      { href: "/tunnukset", label: "Tunnukset" },
      { href: "/vaalijarjestys", label: "Vaalijärjestys" },
      { href: "/tilinumerot", label: "Tilinumerot" },
      { href: "/yhteystiedot", label: "Yhteystiedot" },
      { href: "/brandiohje", label: "Brandiohje" },
      { href: "https://arkisto.tko-aly.fi/", label: "Arkisto", external: true },
      {
        href: "https://bbat.tko-aly.fi/",
        label: "Velat & maksut",
        external: true,
      },
    ],
  },
  {
    label: "Toiminta",
    links: [
      { href: "/edunvalvonta", label: "Edunvalvonta" },
      { href: "/sitsit", label: "Sitsit" },
      { href: "/vuosijuhlat", label: "Vuosijuhlat" },
      { href: "/liikunta", label: "Liikunta" },
      { href: "/ruokavalitys", label: "Ruokavälitys" },
      { href: "/README", label: "README" },
      { href: "https://blog.tko-aly.fi/", label: "Blogi", external: true },
    ],
  },
  {
    label: "Tapahtumat",
    links: [
      { href: "/kalenteri", label: "Kalenteri" },
      { href: "/lisaa-tapahtuma", label: "Lisää tapahtuma" },
    ],
  },
  {
    label: "Turvallisuus",
    links: [
      { href: "/hairinta", label: "Häirintä" },
      {
        href: "https://www.tko-aly.fi/attachments/files/399/Yhdenvertaisuussuunnitelma_2024.pdf?1715249780",
        label: "Yhdenvertaisuus",
        external: true,
      },
      { href: "/tietosuoja", label: "Tietosuoja" },
    ],
  },
  {
    label: "Fukseille",
    links: [
      {
        href: "https://fuksiwiki.tko-aly.fi/Fuksiwiki",
        label: "Fuksiwiki",
        external: true,
      },
      { href: "/fuksi-info", label: "Fuksi-info" },
      {
        href: "https://passi.tko-aly.fi/",
        label: "Fuksipassi",
        external: true,
      },
    ],
  },
  {
    label: "Yritykset",
    links: [
      {
        href: "https://jobs.tko-aly.fi/en/list/open",
        label: "Työpaikat",
        external: true,
      },
      { href: "/yrityksille", label: "Yrityksille" },
    ],
  },
]

const ExternalIcon = () => (
  <Image src="/external-url-10.png" alt="↗" width={10} height={10} />
)

function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className={styles.navbar}>
      <span id={styles["nav-logo"]}>
        <Link href="/">
          <Image
            src="/logo-yellow-on-black.png"
            width={48}
            height={48}
            alt="TKO-aly logo"
          />
        </Link>
      </span>
      <ul className={styles.nav}>
        {navItems.map(section => (
          <li
            key={section.label}
            className={`${styles["nav-item"]} ${styles.dropdown}`}
          >
            <button
              className={styles["dropdown-toggle"]}
              aria-haspopup="true"
              aria-expanded="true"
            >
              {section.label} ▼
            </button>
            <ul className={styles["dropdown-menu"]} role="menu">
              {section.links.map(link => (
                <li key={link.href} role="none">
                  <Link
                    role="menuitem"
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label} {link.external && <ExternalIcon />}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div>
        <Link role="menuitem" href="/english">
          In English
        </Link>
        {session ? (
          <button
            className={styles["dropdown-toggle"]}
            onClick={() => signOut()}
          >
            Kirjaudu ulos
          </button>
        ) : (
          <button
            className={styles["dropdown-toggle"]}
            onClick={() => signIn("tkoaly")}
          >
            Kirjaudu sisään
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
