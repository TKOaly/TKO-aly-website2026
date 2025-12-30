import './index.css';
import externalLinkIcon from '../assets/external-url-10.png';

export default function Index() {
  return (
    <div id="index">
      <div id="splash-img">
        <img src="./src/assets/splash.jpg" alt="Splash" height={900} width={3367} />
      </div>
      <div id="index-logo">
        <div id="index-image">
          <img src="./src/assets/Logo-yellow-on-black.png" alt="Logo" height={300} width={300} />
        </div>
        <div id="index-text">
          <span>Helsingin yliopiston tietojenkäsittelytieteen <br /> 
          <span className="header_bottomline">opiskelijoiden ainejärjestö</span></span>
        </div>
      </div>
      <div id="index-body">
        <div className="diagonal-div">
          <h1>Tervetuloa!</h1>
          <p>TKO-äly ry on Helsingin yliopiston 
            <a href="http://www.cs.helsinki.fi/" rel="noopener noreferrer"> tietojenkäsittelytieteen ja datatieteen <img src={externalLinkIcon} alt="External link" /></a> 
            opiskelijoiden ainejärjestö, joka ajaa opiskelijoiden 
            etua opintoasioissa ja järjestää moninaista vapaa-ajan toimintaa.</p>
          <p>Meidät tavoittaa Kumpulan kampuksen Exactum-rakennuksen opiskelijahuoneesta DK115 
            <a href="http://www.cs.helsinki.fi/contact/exactum-kartat.html#pohja" rel="noopener noreferrer"> Gurula <img src={externalLinkIcon} alt="External link" /></a>
            , jossa myös tarjoamme jäsenistöllemme omakustannehintaan kahvia, limpparia ja naposteltavaa.</p>
          <p>Toiminnastamme saat lisää tietoa näiden sivujen lisäksi seuraamalla 
            <a href="https://www.tko-aly.fi/yhdistys/tiedotus" rel="noopener noreferrer">tiedotustamme <img src={externalLinkIcon} alt="External link" /></a>.</p>
        </div>
      </div>
    </div>
  )
}
