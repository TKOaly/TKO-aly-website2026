import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

import styles from "./page.module.css"

const HomePage = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Link href="/gurula" className={styles.locationBadge}>
            <MapPin size={12} strokeWidth={3} /> Gurula DK115
          </Link>
          <h1 className={styles.heroTitle}>
            Helsingin yliopiston tietojenkäsittelytieteen opiskelijoiden
            ainejärjestö
          </h1>
          <p className={styles.heroDesc}>
            Tervetuloa! TKO-äly ry on Helsingin yliopiston
            tietojenkäsittelytieteen ja datatieteen opiskelijoiden ainejärjestö.
            Järjestämme tapahtumia, valvomme etujasi ja ylläpidämme yhteistä
            olohuonettamme Gurulaa.
          </p>
          <div>
            <button className={styles.joinButton}>LIITY JÄSENEKSI</button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <Image
            className={styles.heroImage}
            alt="Students collaborating"
            src="/splash.jpg"
            width={500}
            height={500}
            loading="eager"
          />
          <div className={styles.imageOverlay}>&gt;_ TKO-äly.webp</div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
