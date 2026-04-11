"use client"

import Link from "next/link"
import styles from "./Footer.module.css"
import Image from "next/image"
import { ClientLink, useTranslation } from "@/app/i18n/client"
import footerData from "../../data/footer.json"
import sponsorsData from "../../data/sponsors.json"

export default function Footer() {
  const { t, lang } = useTranslation()
  return (
    <>
      <section className={styles.sponsors}>
        <div className={styles.sponsorsInner}>
          <div className={styles.sponsorsTitleRow}>
            <h2 className={styles.sponsorsTitle}>{t("footer.partners")}</h2>
            <div className={styles.sponsorsDivider} />
          </div>
          <div className={styles.sponsorGrid}>
            {sponsorsData.map(s => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sponsorLink}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={s.alt} src={s.src} className={styles.sponsorLogo} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.cards}>
        {/* Keltainen kortti */}
        <section className={`${styles.card} ${styles.cardAccent}`}>
          <Image
            src="/logo-yellow-on-black.png"
            width={96}
            height={96}
            alt="TKO-aly logo"
          />
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.post")}</h2>
            <p className={styles.cardText}>
              TKO-äly ry / TKTO
              <br />
              PL 68
              <br />
              00014 Helsingin yliopisto
            </p>
          </div>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.businessId")}</h2>
            <p className={styles.cardText}>1978827-2</p>
          </div>
        </section>

        {/* Yhteystiedot */}
        <section className={styles.card}>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.email")}</h2>
            <p className={styles.cardText}>hallitus ät tko-aly.fi</p>
          </div>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.chair")}</h2>
            <p className={styles.cardText}>pj ät tko-aly.fi</p>
          </div>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.phone")}</h2>
            <p className={styles.cardText}>+358-50-4480186</p>
          </div>
          <div className={styles.formLinks}>
            <ClientLink
              href="/palaute"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.formLink}
            >
              {t("footer.feedbackForm")}
            </ClientLink>
            <ClientLink
              href="/hairinta"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.formLink}
            >
              {t("footer.harassmentContacts")}
            </ClientLink>
          </div>
        </section>

        {/* Talous */}
        <section className={styles.card}>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.accountNumbers")}</h2>
            <p className={styles.cardText}>
              Päätili FI89 7997 7995 1312 86
              <br />
              Ruokavälitys FI05 7997 7991 9503 25
              <br />
              BIC HOLVFIHH
            </p>
          </div>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.eInvoicing")}</h2>
            <p className={styles.cardText}>
              TKO-äly ry
              <br />
              003719788272
              <br />
              Op.tunnus: 003723327487
              <br />
              Apix Messaging Oy
            </p>
          </div>
        </section>

        {/* Linkit */}
        <section className={styles.card}>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.links")}</h2>
            <ul className={styles.linkList}>
              {footerData.map(link => {
                const isExternal = link.href.startsWith("http")
                const label = link.labels[lang as keyof typeof link.labels]
                return (
                  <li key={link.href} className={styles.linkItem}>
                    {isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.navLink}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link href={link.href} className={styles.navLink}>
                        {label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </footer>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        © {new Date().getFullYear()} TKO-äly ry
      </div>
    </>
  )
}
