import styles from "./Footer.module.css"

function Footer() {
  return (
    <div id={styles.footer} className={styles.footer}>
      <div className={styles["footer-content"]}>
        <span>
          <strong>Posti</strong> <br />
          TKO-äly ry / TKTO
          <br />
          PL 68
          <br />
          00014 Helsingin yliopisto
        </span>
        <br />
        <br />
        <span>
          <strong> Y-tunnus</strong> <br />
          1978827-2
        </span>
      </div>
      <div className={styles["footer-content"]}>
        <span>
          <strong>Sähköposti</strong> <br />
          hallitus ät tko-aly.fi
          <br />
          <br />
          <strong>Puheenjohtaja</strong>
          <br />
          pj ät tko-aly.fi
          <br />
          <br />
          <a href="https://tko-aly.fi/palaute" target="_blank">
            Yleinen palautelomake
          </a>
          <br />
          <br />
          <a href="https://tko-aly.fi/häirintälomake" target="_blank">
            Häirintäyhdyshenkilöiden <br />
            yhteydenottolomake
          </a>
        </span>
      </div>
      <div className={styles["footer-content"]}>
        <span>
          <strong>Puhelin opiskelijahuone</strong>
          <br />
          <strong>Gurulaan</strong>
          <br />
          +358-50-4480186
          <br />
          <br />
          <strong>Tilinumerot</strong>
          <br />
          Päätili FI89 7997 7995 1312 86
          <br />
          Ruokavälitys FI05 7997 7991 9503 25
          <br />
          BIC HOLVFIHH
          <br />
          <br />
          <strong>Verkkolaskutus</strong>
          <br />
          TKO-äly ry
          <br />
          Osoite: 003719788272
          <br />
          Operaattoritunnus: 003723327487
          <br />
          Välittäjä: Apix Messaging Oy
        </span>
      </div>
      <div className={styles.overlap}></div>
    </div>
  )
}

export default Footer
