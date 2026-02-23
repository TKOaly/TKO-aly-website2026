import Alert from "@/components/Alert/Alert"
import Card from "@/components/Card/Card"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import MobileCallToActionButton from "@/components/Buttons/CallToActionButton"
import PageHeader from "@/components/PageHeader/PageHeader"

import styles from "./Jaseneksi.module.css"

const MembershipPage = () => {
  return (
    <main className={styles.main}>
      <PageHeader
        title="Liity Jäseneksi"
        description="Voit rekisteröityä jäseneksi tällä lomakkeella. Voit maksaa joko
        tilisiirrolla tai sopia käteismaksusta hallituslaisen kanssa."
      />

      <Card>
        <h2 className={styles.cardTitle}>Jäsenmaksun suuruus</h2>
        <p className={styles.cardText}>
          1 vuosi <strong>4,00 EUR</strong>, 3 vuotta <strong>10,00 EUR</strong>
          , 5 vuotta <strong>15,00 EUR</strong>.
        </p>
        <Alert title="HUOM!">
          Jäsenkausi päättyy 31.7. Mikäli ostat jäsenkauden ennen tätä
          päiväystä, jäsenyydestäsi katsotaan kuluneen ensimmäinen vuosi 31.7.
          alkaen.
        </Alert>
      </Card>

      {/* Form */}
      <form className={styles.form} action="#" method="post">
        {/* Henkilötiedot */}
        <Fieldset legend="Henkilötiedot">
          <Field
            required
            label="Käyttäjätunnus"
            id="username"
            name="username"
            type="text"
            placeholder="esim. teekkari123"
            autoComplete="username"
          />

          <Field
            required
            label="Koko nimi"
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Matti Meikäläinen"
            autoComplete="name"
            hint="Yhdistyslaki edellyttää kaikki etunimet sekä sukunimen."
          />

          <Field
            required
            label="Kutsumanimi"
            id="nickname"
            name="nickname"
            type="text"
            placeholder="Masa"
            autoComplete="given-name"
            hint="Kutsumanimi näkyy muille käyttäjille."
          />

          <Field
            required
            label="Sähköposti"
            id="email"
            name="email"
            type="email"
            placeholder="matti@example.com"
            autoComplete="email"
          />

          <Field
            required
            label="Kotikunta"
            id="hometown"
            name="hometown"
            type="text"
            placeholder="Helsinki"
          />

          <Field
            label="Puhelinnumero"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+358 40 123 4567"
            autoComplete="tel"
          />

          <div className={styles.passwordGrid}>
            <Field
              required
              label="Salasana"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              required
              label="Salasana uudelleen"
              id="password-confirm"
              name="password_confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </Fieldset>
        {/* Muut tiedot */}
        <Fieldset legend="Muut tiedot">
          <div className={styles.checkboxList}>
            <Checkbox
              id="studies"
              name="studies_helsinki"
              label="Opiskelen Helsingin yliopistossa."
            />
            <div className={styles.checkboxGroup}>
              <Checkbox
                id="studies_cs"
                name="studies_cs"
                label="Opiskelen/opiskelin tietojenkäsittelytiedettä tai datatiedettä."
              />
              <Alert title="HUOM!">
                Voit liittyä varsinaiseksi jäseneksi vain jos opiskelet tai olet
                opiskellut tietojenkäsittelytieteitä tai datatiedettä Helsingin
                yliopistossa. Muutoin voit liittyä ulkojäseneksi.
              </Alert>
            </div>

            <Checkbox
              id="staff"
              name="staff"
              label="Olen Helsingin yliopiston henkilökunnan jäsen."
            />

            <Checkbox
              id="hyy_member"
              name="hyy_member"
              label="Olen HYY:n jäsen."
            />

            <Checkbox
              id="interested_cs"
              name="interested_cs"
              label="Olen kiinnostunut tietojenkäsittelytieteestä."
            />
          </div>
        </Fieldset>
        {/* Tietosuoja */}
        <Fieldset legend="Tietosuoja">
          <div className={styles.checkboxList}>
            <Checkbox id="accept_terms" name="accept_terms" required>
              <>
                Olen lukenut ja hyväksyn{" "}
                <a className={styles.link} href="#">
                  käyttöehdot
                </a>
              </>
            </Checkbox>

            <Checkbox id="accept_privacy" name="accept_privacy" required>
              <>
                Hyväksyn{" "}
                <a className={styles.link} href="#">
                  jäsenrekisterin tietosuojaselosteen
                </a>
              </>
            </Checkbox>
          </div>
        </Fieldset>
      </form>

      <MobileCallToActionButton form="membership-form">
        Liity jäseneksi
      </MobileCallToActionButton>
    </main>
  )
}

export default MembershipPage
