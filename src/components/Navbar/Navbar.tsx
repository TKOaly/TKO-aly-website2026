import './Navbar.css'
import { Link } from 'react-router-dom'
import externalLinkIcon from '../../assets/external-url-10.png';

function Navbar() {
    return (
        <nav id="navbar" className="navbar">
            <ul className="nav">
                <li id="nav-logo">
                    <Link to="/"><img src="../../src/assets/logo-yellow-on-black.png" width="50" height="50" alt="Logo" /></Link>
                </li>

                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="true">
                        Yhdistys ▼
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="none">
                            <Link role="menuitem" to="/hallitus">Hallitus </Link>
                            <Link role="menuitem" to="/tiedotus">Tiedotus</Link>
                            <Link role="menuitem" to="/säännöt">Säännöt</Link>
                            <Link role="menuitem" to="/talous">Talous</Link>
                            <Link role="menuitem" to="/tunnukset">Tunnukset</Link>
                            <Link role="menuitem" to="/vaalijarjestys">Vaalijärjestys</Link>
                            <Link role="menuitem" to="/tilinumerot">Tilinumerot</Link>
                            <Link role="menuitem" to="/yhteystiedot">Yhteystiedot</Link>
                            <Link role="menuitem" to="/brandiohje">Brandiohje</Link>
                            <Link role="menuitem" to="https://arkisto.tko-aly.fi/">
                                Arkisto <img src={externalLinkIcon} alt="External link" /></Link>
                        </li>
                    </ul>
                </li>

                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        Toiminta ▼
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="none">
                            <Link role="menuitem" to="/edunvalvonta">Edunvalvonta</Link>
                            <Link role="menuitem" to="/sitsit">Sitsit</Link>
                            <Link role="menuitem" to="/vuosijuhlat">Vuosijuhlat</Link>
                            <Link role="menuitem" to="/liikunta">Liikunta</Link>
                            <Link role="menuitem" to="/ruokavalitys">Ruokavälitys</Link>
                            <Link role="menuitem" to="/README">README</Link>
                            <Link role="menuitem" to="https://blog.tko-aly.fi/">
                            Blogi <img src={externalLinkIcon} alt="External link" /></Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        Tapahtumat ▼
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="none">
                            <Link role="menuitem" to="/kalenteri">Kalenteri</Link>
                            <Link role="menuitem" to="/lisaa-tapahtuma">Lisää tapahtuma</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        Turvallisuus ▼
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="none">
                            <Link role="menuitem" to="/hairinta">Häirintä</Link>
                            <Link role="menuitem" to="https://www.tko-aly.fi/attachments/files/399/Yhdenvertaisuussuunnitelma_2024.pdf?1715249780">
                            Yhdenvertaisuus <img src={externalLinkIcon} alt="External link" /></Link>
                            <Link role="menuitem" to="/tietosuoja">Tietosuoja</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        Fukseille ▼
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="none">
                            <Link role="menuitem" to="https://fuksiwiki.tko-aly.fi/Fuksiwiki">
                            Fuksiwiki <img src={externalLinkIcon} alt="External link" /></Link>
                            <Link role="menuitem" to="/fuksi-info">Fuksi-info</Link>
                            <Link role="menuitem" to="https://passi.tko-aly.fi/">
                            Fuksipassi <img src={externalLinkIcon} alt="External link" /></Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        Yritykset ▼
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li role="none">
                            <Link role="menuitem" to="https://jobs.tko-aly.fi/en/list/open">
                            Työpaikat <img src={externalLinkIcon} alt="External link" /></Link>
                            <Link role="menuitem" to="/yrityksille">Yrityksille</Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        <Link role="menuitem" to="https://bbat.tko-aly.fi/">
                        Velat & maksut <img src={externalLinkIcon} alt="External link" /></Link>
                    </button>
                </li>
                <li className="nav-item dropdown">
                    <button className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                        <Link role="menuitem" to="/english">In English</Link>
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar