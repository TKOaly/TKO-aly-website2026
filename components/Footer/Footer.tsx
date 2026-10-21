"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import styles from "./Footer.module.css"
import Image from "next/image"
import { ClientLink, useTranslation } from "@/app/i18n/client"

export type FooterLinkType = {
  href: string
  labels: { fi: string; en: string }
}

export type SponsorType = {
  href: string
  src: string
  alt: string
}

type FooterProps = {
  footerData: FooterLinkType[]
  sponsorsData: SponsorType[]
}

function Copyable({
  display,
  value,
  copyLabel,
  copiedLabel,
  onCopied,
}: {
  display: string
  value: string
  copyLabel: string
  copiedLabel: string
  onCopied: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopied()
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <span className={styles.copyRow}>
      <span>{display}</span>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copy}
        aria-label={copied ? copiedLabel : `${copyLabel}: ${display}`}
      >
        {copied ? (
          <Check size={14} aria-hidden />
        ) : (
          <Copy size={14} aria-hidden />
        )}
      </button>
    </span>
  )
}

export default function FooterClient({
  footerData,
  sponsorsData,
}: FooterProps) {
  const { t, lang } = useTranslation()
  const copyLabel = t("common.copy")
  const copiedLabel = t("common.copied")
  const opensInNew = t("common.opensInNewWindow")
  const [liveStatus, setLiveStatus] = useState("")

  const onCopied = () => {
    setLiveStatus(copiedLabel)
    window.setTimeout(() => setLiveStatus(""), 1600)
  }

  return (
    <div className={styles.footerContainer}>
      <section className={styles.sponsors}>
        <div className={styles.sponsorsInner}>
          <div className={styles.sponsorsTitleRow}>
            <h2 className={styles.sponsorsTitle}>{t("footer.partners")}</h2>
            <div className={styles.sponsorsDivider} />
            <ClientLink href="/yrityksille" className="btn">
              {t("footer.collaborate")}
            </ClientLink>
          </div>
          <p className={styles.partnersThanks}>{t("footer.partnersThanks")}</p>
          <div className={styles.sponsorGrid}>
            {sponsorsData.map(s => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sponsorLink}
                aria-label={`${s.alt} (${opensInNew})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={s.src} className={styles.sponsorLogo} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.srOnly} aria-live="polite">
        {liveStatus}
      </div>

      <footer className={styles.cards}>
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
            <p className={styles.cardText}>
              <Copyable
                display="1978827-2"
                value="1978827-2"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
            </p>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardHeading}>{t("footer.contact")}</h2>
          <div className={styles.cardSection}>
            <h3 className={styles.cardSubheading}>{t("footer.email")}</h3>
            <p className={styles.cardText}>
              <Copyable
                display="hallitus ät tko-aly.fi"
                value="hallitus@tko-aly.fi"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
            </p>
          </div>
          <div className={styles.cardSection}>
            <h3 className={styles.cardSubheading}>{t("footer.chair")}</h3>
            <p className={styles.cardText}>
              <Copyable
                display="pj ät tko-aly.fi"
                value="pj@tko-aly.fi"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
            </p>
          </div>
          <div className={styles.cardSection}>
            <h3 className={styles.cardSubheading}>{t("footer.phone")}</h3>
            <p className={styles.cardText}>
              <Copyable
                display="+358-50-4480186"
                value="+358504480186"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
            </p>
          </div>
          <div className={styles.formLinks}>
            <ClientLink
              href="/palaute"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {t("footer.feedbackForm")}
              <ExternalLink size={14} aria-hidden />
              <span className={styles.srOnly}>({opensInNew})</span>
            </ClientLink>
            <ClientLink
              href="/hairinta"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {t("footer.harassmentContacts")}
              <ExternalLink size={14} aria-hidden />
              <span className={styles.srOnly}>({opensInNew})</span>
            </ClientLink>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.accountNumbers")}</h2>
            <p className={styles.cardText}>
              Päätili{" "}
              <Copyable
                display="FI89 7997 7995 1312 86"
                value="FI8979977995131286"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
              <br />
              Ruokavälitys{" "}
              <Copyable
                display="FI05 7997 7991 9503 25"
                value="FI0579977991950325"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
              <br />
              BIC{" "}
              <Copyable
                display="HOLVFIHH"
                value="HOLVFIHH"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
            </p>
          </div>
          <div className={styles.cardSection}>
            <h2 className={styles.cardHeading}>{t("footer.eInvoicing")}</h2>
            <p className={styles.cardText}>
              TKO-äly ry
              <br />
              <Copyable
                display="003719788272"
                value="003719788272"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
              <br />
              Op.tunnus:{" "}
              <Copyable
                display="003723327487"
                value="003723327487"
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                onCopied={onCopied}
              />
              <br />
              Apix Messaging Oy
            </p>
          </div>
        </section>

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
                        <ExternalLink size={12} aria-hidden />
                        <span className={styles.srOnly}>({opensInNew})</span>
                      </a>
                    ) : (
                      <ClientLink href={link.href} className={styles.navLink}>
                        {label}
                      </ClientLink>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </footer>

      <div className={styles.bottomBar}>
        © {new Date().getFullYear()} TKO-äly ry
      </div>
    </div>
  )
}
