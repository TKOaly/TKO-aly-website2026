import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import Fieldset from "@/components/Fieldset/Fieldset"
import PageHeader from "@/components/PageHeader/PageHeader"

import styles from "./Muokkaa.module.css"

const EditUserPage = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Muokkaa omia tietoja" />

      <form id="edit-user-form" className={styles.form}>
        <Fieldset legend="Henkilötiedot">
          <Field
            label="Käyttäjätunnus"
            id="username"
            name="username"
            type="text"
            defaultValue="boriss"
            autoComplete="username"
          />

          <Field
            label="Koko nimi"
            id="fullname"
            name="fullname"
            type="text"
            defaultValue="boriss jerjomkin"
            autoComplete="name"
            hint="Yhdistyslaki edellyttää kaikki etunimet sekä sukunimen."
          />

          <Field
            label="Kutsumanimi"
            id="nickname"
            name="nickname"
            type="text"
            defaultValue="borre"
            autoComplete="given-name"
            hint="Kutsumanimi näkyy muille käyttäjille."
          />

          <Field
            label="Email"
            id="email"
            name="email"
            type="email"
            defaultValue="boriss.jerjomkin@helsinki.fi"
            autoComplete="email"
          />

          <Field
            label="Kotikunta"
            id="hometown"
            name="hometown"
            type="text"
            defaultValue="helsinki"
          />

          <Field
            label="Puhelinnumero"
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
          />

          <FieldSelect
            label="Käyttäjärooli"
            id="role"
            name="role"
            defaultValue="user"
            disabled
          >
            <option value="user">Käyttäjä</option>
          </FieldSelect>

          <FieldSelect
            label="Jäsentyyppi"
            id="member_type"
            name="member_type"
            defaultValue="jasen"
            disabled
          >
            <option value="jasen">Jäsen</option>
            <option value="ulkoinen-jasen">Ulkoinen jäsen</option>
            <option value="ei-jasen">Ei jäsen</option>
          </FieldSelect>

          <Field
            label="Liittymispäivä"
            id="membership_start"
            name="membership_start"
            type="date"
            defaultValue="2025-08-26"
            readOnly
          />

          <div className={styles.passwordGrid}>
            <Field
              label="Uusi salasana"
              id="new_password"
              name="new_password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              label="Uusi salasana uudelleen"
              id="new_password_confirm"
              name="new_password_confirm"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
        </Fieldset>

        <Fieldset legend="Muut tiedot">
          <div className={styles.checkboxList}>
            <Checkbox
              id="studies_helsinki"
              name="studies_helsinki"
              label="Opiskelen Helsingin yliopistossa"
            />
            <Checkbox
              id="studies_cs"
              name="studies_cs"
              label="Opiskelen/opiskelin tietojenkäsittelytiedettä tai datatiedettä"
            />
            <Checkbox
              id="staff"
              name="staff"
              label="Olen Helsingin yliopiston henkilökunnan jäsen"
            />
            <Checkbox
              id="hyy_member"
              name="hyy_member"
              label="Olen HYY:n jäsen"
            />
            <Checkbox
              id="interested_cs"
              name="interested_cs"
              label="Olen kiinnostunut tietojenkäsittelytieteestä"
            />
          </div>
        </Fieldset>

        <p className={styles.privacyNote}>
          <a className={styles.link} href="#">
            Jäsenrekisterin tietosuojaseloste
          </a>
        </p>
      </form>

      <CallToActionButton form="edit-user-form">
        Tallenna muutokset
      </CallToActionButton>
    </main>
  )
}

export default EditUserPage
