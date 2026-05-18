import Script from "next/script"

import styles from "./TikTokSection.module.css"

const TikTokSection = () => {
  return (
    <section className={styles.tiktokSection}>
      <div className={styles.tiktokHeader}>
        <h2>TIKTOK</h2>
      </div>

      <blockquote
        className="tiktok-embed"
        cite="https://www.tiktok.com/@tkoaly.ry"
        data-unique-id="tkoaly.ry"
        data-embed-type="creator"
        style={{ maxWidth: "780px", minWidth: "288px" }}
      >
        <section>
          <a
            target="_blank"
            href="https://www.tiktok.com/@tkoaly.ry?refer=creator_embed"
          >
            @tkoaly.ry
          </a>
        </section>
      </blockquote>
      {/* TikTok's embed script required to render the blockquote */}
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="afterInteractive"
      />
    </section>
  )
}

export default TikTokSection
