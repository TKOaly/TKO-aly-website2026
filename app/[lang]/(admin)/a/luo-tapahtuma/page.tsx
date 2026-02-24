import Alert from "@/components/Alert/Alert"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import PageHeader from "@/components/PageHeader/PageHeader"
import Textarea from "@/components/Textarea/Textarea"

import styles from "./LuoTapahtuma.module.css"

const AddEventPage = () => {
  return (
    <main className={styles.main}>
      <PageHeader title="Uusi tapahtuma">
        Haluatko <i>sinä</i> järjestää tapahtuman?{" "}
        <a href="#" className={styles.link}>
          Katso ohjeet täältä!
        </a>
      </PageHeader>

      <section className={styles.section}>
        {/* Template picker */}
        <div className={styles.templateSection}>
          <FieldSelect id="template" label="Hae tapahtumapohja">
            <option value="">-- Valitse tapahtumapohja listasta --</option>
          </FieldSelect>
        </div>

        <form id="new-event-form" className={styles.form}>
          {/* Pakolliset tiedot */}
          <Fieldset legend="Pakolliset tiedot">
            <Field
              required
              label="Tapahtuman nimi"
              id="name"
              name="name"
              type="text"
            />
            <Field
              required
              label="Päivämäärä"
              id="date"
              name="date"
              type="date"
            />
            <Field required label="Aika" id="time" name="time" type="time" />

            <Field
              required
              label="Tapahtuman paikka"
              id="venue"
              name="venue"
              type="text"
              list="venue-datalist"
              placeholder="-- Valitse listasta tai kirjoita uusi --"
            />
            <datalist id="venue-datalist">
              <option value="Paikka 1" />
              <option value="Paikka 2" />
              <option value="Paikka 3" />
            </datalist>

            <Field
              required
              label="Tapahtuman tyyppi"
              id="event_type"
              name="event_type"
              type="text"
              placeholder="-- Valitse listasta tai kirjoita uusi --"
              list="event-type-datalist"
            />
            <datalist id="event-type-datalist">
              <option value="Tyyppi 1" />
              <option value="Tyyppi 2" />
              <option value="Tyyppi 3" />
            </datalist>

            <Textarea
              required
              id="description"
              label="Tapahtuman kuvaus"
              name="description"
              rows={5}
            />
          </Fieldset>

          {/* Valinnaiset tiedot */}
          <Fieldset legend="Valinnaiset tiedot">
            <Field
              label="Järjestävä taho"
              id="organizer"
              name="organizer"
              type="text"
            />
            <Field
              label="Järjestävä taho (URL)"
              id="organizer_url"
              name="organizer_url"
              type="url"
            />
            <Field
              label="Vastuuhenkilön nimi"
              id="contact_name"
              name="contact_name"
              type="text"
            />
            <Checkbox
              id="show_contact"
              name="show_contact"
              label="Vastuuhenkilön tiedot näytetään"
            />

            <FieldRadioGroup
              legend="Maksullisuus"
              name="payment"
              options={[
                { value: "paid", label: "Maksullinen" },
                { value: "free", label: "Maksuton", defaultChecked: true },
              ]}
            />

            <Field label="Hinta" id="price" name="price" type="text" />
            <Field
              label="Karttalinkki"
              id="map_link"
              name="map_link"
              type="url"
            />

            <FieldSelect id="alcohol_scale" label="Alkoholiasteikko">
              <option value="">-- Valitse --</option>
              <option value="0">0 - Ei alkoholia</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3 - Kohtuullisesti</option>
              <option value="4">4</option>
              <option value="5">5 - Runsaasti alkoholia</option>
            </FieldSelect>

            <div className={styles.checkboxList}>
              <Checkbox
                id="can_participate"
                name="can_participate"
                label="Tapahtumaan voi ilmoittautua"
              />
              <Checkbox
                id="membership_required"
                name="membership_required"
                label="Ilmoittautujien oltava jäseniä"
              />
              <Checkbox
                id="avec"
                name="avec"
                label="Tapahtumaan voi ilmoittaa seuralaisen"
              />
            </div>

            <Field
              label="Suurin osallistujamäärä"
              id="max_participants"
              name="max_participants"
              type="number"
              min="0"
            />
            <Field
              label="Ilmoittautumisen alku"
              id="registration_starts"
              name="registration_starts"
              type="datetime-local"
            />
            <Field
              label="Ilmoittautumisen loppu"
              id="registration_ends"
              name="registration_ends"
              type="datetime-local"
            />

            <Alert>Näillä voit asettaa tyypillisimmät perumistavat:</Alert>

            <Field
              label="Ilmoittautumisen perumisen alku"
              id="cancellation_starts"
              name="cancellation_starts"
              type="datetime-local"
            />
            <Field
              label="Ilmoittautumisen perumisen loppu"
              id="cancellation_ends"
              name="cancellation_ends"
              type="datetime-local"
            />

            <Checkbox
              id="save_as_template"
              name="save_as_template"
              label="Tallenna tapahtumapohjaksi"
            />
          </Fieldset>
        </form>
      </section>

      <CallToActionButton form="new-event-form">
        Luo tapahtuma
      </CallToActionButton>
    </main>
  )
}

export default AddEventPage
