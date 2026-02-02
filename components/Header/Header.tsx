import Link from "next/link"
import Image from "next/image"
import styles from "./Header.module.css"

function Header() {
  return (
    <div id={styles.header} className={styles.header}>
      <h1>
        <Link href="/">
          <Image
            src="/logo-yellow-on-black.png"
            width={150}
            height={150}
            alt="Logo"
          />
          <span>
            Helsingin yliopiston tietojenkäsittelytieteen <br />{" "}
            <span className={styles.header_bottomline}>
              opiskelijoiden ainejärjestö
            </span>
          </span>
        </Link>
      </h1>
    </div>
  )
}

export default Header
