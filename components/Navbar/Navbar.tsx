import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";

import externalLinkIcon from "@/public/external-url-10.png";
import logoImage from "@/public/logo-yellow-on-black.png";

function Navbar() {
  return (
    <nav id="navbar" className="navbar">
      <ul className="nav">
        <li id="nav-logo">
          <Link href="/">
            <Image src={logoImage} width={50} height={50} alt="Logo" />
          </Link>
        </li>

        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="true"
          >
            Yhdistys ▼
          </button>
          <ul className="dropdown-menu" role="menu">
            <li role="none">
              <Link role="menuitem" href="/hallitus">
                Hallitus{" "}
              </Link>
              <Link role="menuitem" href="/tiedotus">
                Tiedotus
              </Link>
              <Link role="menuitem" href="/saannot">
                Säännöt
              </Link>
              <Link role="menuitem" href="/talous">
                Talous
              </Link>
              <Link role="menuitem" href="/tunnukset">
                Tunnukset
              </Link>
              <Link role="menuitem" href="/vaalijarjestys">
                Vaalijärjestys
              </Link>
              <Link role="menuitem" href="/tilinumerot">
                Tilinumerot
              </Link>
              <Link role="menuitem" href="/yhteystiedot">
                Yhteystiedot
              </Link>
              <Link role="menuitem" href="/brandiohje">
                Brandiohje
              </Link>
              <Link role="menuitem" href="https://arkisto.tko-aly.fi/">
                Arkisto{" "}
                <Image
                  src={externalLinkIcon}
                  alt="External link"
                  width={10}
                  height={10}
                />
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Toiminta ▼
          </button>
          <ul className="dropdown-menu" role="menu">
            <li role="none">
              <Link role="menuitem" href="/edunvalvonta">
                Edunvalvonta
              </Link>
              <Link role="menuitem" href="/sitsit">
                Sitsit
              </Link>
              <Link role="menuitem" href="/vuosijuhlat">
                Vuosijuhlat
              </Link>
              <Link role="menuitem" href="/liikunta">
                Liikunta
              </Link>
              <Link role="menuitem" href="/ruokavalitys">
                Ruokavälitys
              </Link>
              <Link role="menuitem" href="/README">
                README
              </Link>
              <Link role="menuitem" href="https://blog.tko-aly.fi/">
                Blogi{" "}
                <Image
                  src={externalLinkIcon}
                  alt="External link"
                  width={10}
                  height={10}
                />
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Tapahtumat ▼
          </button>
          <ul className="dropdown-menu" role="menu">
            <li role="none">
              <Link role="menuitem" href="/kalenteri">
                Kalenteri
              </Link>
              <Link role="menuitem" href="/lisaa-tapahtuma">
                Lisää tapahtuma
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Turvallisuus ▼
          </button>
          <ul className="dropdown-menu" role="menu">
            <li role="none">
              <Link role="menuitem" href="/hairinta">
                Häirintä
              </Link>
              <Link
                role="menuitem"
                href="https://www.tko-aly.fi/attachments/files/399/Yhdenvertaisuussuunnitelma_2024.pdf?1715249780"
              >
                Yhdenvertaisuus{" "}
                <Image
                  src={externalLinkIcon}
                  alt="External link"
                  width={10}
                  height={10}
                />
              </Link>
              <Link role="menuitem" href="/tietosuoja">
                Tietosuoja
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Fukseille ▼
          </button>
          <ul className="dropdown-menu" role="menu">
            <li role="none">
              <Link
                role="menuitem"
                href="https://fuksiwiki.tko-aly.fi/Fuksiwiki"
              >
                Fuksiwiki{" "}
                <Image
                  src={externalLinkIcon}
                  alt="External link"
                  width={10}
                  height={10}
                />
              </Link>
              <Link role="menuitem" href="/fuksi-info">
                Fuksi-info
              </Link>
              <Link role="menuitem" href="https://passi.tko-aly.fi/">
                Fuksipassi{" "}
                <Image
                  src={externalLinkIcon}
                  alt="External link"
                  width={10}
                  height={10}
                />
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Yritykset ▼
          </button>
          <ul className="dropdown-menu" role="menu">
            <li role="none">
              <Link role="menuitem" href="https://jobs.tko-aly.fi/en/list/open">
                Työpaikat{" "}
                <Image
                  src={externalLinkIcon}
                  alt="External link"
                  width={10}
                  height={10}
                />
              </Link>
              <Link role="menuitem" href="/yrityksille">
                Yrityksille
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Link role="menuitem" href="https://bbat.tko-aly.fi/">
              Velat & maksut{" "}
              <Image
                src={externalLinkIcon}
                alt="External link"
                width={10}
                height={10}
              />
            </Link>
          </button>
        </li>
        <li className="nav-item dropdown">
          <button
            className="dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Link role="menuitem" href="/english">
              In English
            </Link>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
