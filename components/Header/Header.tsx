import styles from "./Header.module.css";

function Header() {
  return (
    <div id={styles.header} className={styles.header}>
      <h1>
        <a href="/">
          <img
            src="../../src/assets/logo-yellow-on-black.png"
            width="150"
            height="150"
            alt="Logo"
          />
          <span>
            Helsingin yliopiston tietojenkäsittelytieteen <br />{" "}
            <span className={styles.header_bottomline}>
              opiskelijoiden ainejärjestö
            </span>
          </span>
        </a>
      </h1>
    </div>
  );
}

export default Header;
