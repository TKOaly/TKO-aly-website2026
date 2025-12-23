import './Header.css'

function Header() {
    return (
        <div id="header">
            <h1>
                <a href="/">
                    <img src="../../src/assets/logo-yellow-on-black.png" width="150" height="150" alt="Logo" />
                    <span>Helsingin yliopiston tietojenkäsittelytieteen <br /> opiskelijoiden ainejärjestö</span>
                </a>
            </h1>
        </div>
    )
}

export default Header