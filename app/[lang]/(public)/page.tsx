import Image from "next/image"

import styles from "./page.module.css"
import { ExternalLink } from "lucide-react"

export default function Index() {
  return (
    <>
      <header className={styles.index}>
        <div className={styles.splashImage}>
          <Image src="/splash.jpg" alt="Splash" height={900} width={3367} />
        </div>
        <div className={styles.logo}>
          <div className={styles.image}>
            <Image
              src="/logo-yellow-on-black.png"
              alt="Logo"
              height={300}
              width={300}
            />
          </div>
          <h1 className={styles.heading}>
            Helsingin yliopiston tietojenkäsittelytieteen <br />
            opiskelijoiden ainejärjestö
          </h1>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.diagonalDiv}>
          <div>
            <h2>Tervetuloa!</h2>
            <p>
              TKO-äly ry on Helsingin yliopiston{" "}
              <a href="http://www.cs.helsinki.fi/" rel="noopener noreferrer">
                tietojenkäsittelytieteen ja datatieteen
                <ExternalLink height={16} width={16} />
              </a>{" "}
              opiskelijoiden ainejärjestö, joka ajaa opiskelijoiden etua
              opintoasioissa ja järjestää moninaista vapaa-ajan toimintaa.
            </p>
            <p>
              Meidät tavoittaa Kumpulan kampuksen Exactum-rakennuksen
              opiskelijahuoneesta DK115{" "}
              <a
                href="http://www.cs.helsinki.fi/contact/exactum-kartat.html#pohja"
                rel="noopener noreferrer"
              >
                Gurula
                <ExternalLink height={16} width={16} />
              </a>
              , jossa myös tarjoamme jäsenistöllemme omakustannehintaan kahvia,
              limpparia ja naposteltavaa.
            </p>
            <p>
              Toiminnastamme saat lisää tietoa näiden sivujen lisäksi{" "}
              seuraamalla{" "}
              <a
                href="https://www.tko-aly.fi/yhdistys/tiedotus"
                rel="noopener noreferrer"
              >
                tiedotustamme
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
