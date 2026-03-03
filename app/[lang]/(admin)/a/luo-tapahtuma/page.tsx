import Alert from "@/components/Alert/Alert"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import PageHeader from "@/components/PageHeader/PageHeader"
import Textarea from "@/components/Textarea/Textarea"
import { getAsyncTranslation } from "@/app/i18n"

import styles from "./LuoTapahtuma.module.css"

type Props = {
  params: Promise<{ lang: string }>
}

type PostEventPayload = {
  user_id?: number
  name: string
  created?: Date
  starts?: Date
  registration_starts?: Date
  registration_ends?: Date
  cancellation_starts?: Date
  cancellation_ends?: Date
  location?: string
  category?: string
  description?: string
  alcohol_meter?: number
  price?: string
  map?: string
  max_participants?: number
  realised_participants?: number
  membership_required?: boolean
  outsiders_allowed?: boolean
  template?: boolean
  responsible?: string
  show_responsible?: boolean
  avec?: boolean
  deleted?: boolean
}

const parseOptionalNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const parseOptionalDate = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const parseCheckbox = (value: FormDataEntryValue | null) => value === "on"

const parseOptionalText = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

const AddEventPage = async ({ params }: Props) => {
  const { lang } = await params
  const { t } = await getAsyncTranslation(lang)

  const createEvent = async (formData: FormData) => {
    "use server"
    const baseUrl =
      process.env.EVENTS_API_BASE_URL ?? "http://events-microservice:3040"
    const token =
      process.env.EVENT_SERVICE_TOKEN ?? process.env.SERVICE_AUTH_TOKEN

    const date = formData.get("date")
    const time = formData.get("time")
    const startsValue =
      typeof date === "string" &&
      typeof time === "string" &&
      date !== "" &&
      time !== ""
        ? `${date}T${time}`
        : null

    const payload: PostEventPayload = {
      name: String(formData.get("name") ?? "").trim(),
      starts: parseOptionalDate(startsValue),
      registration_starts: parseOptionalDate(
        formData.get("registration_starts"),
      ),
      registration_ends: parseOptionalDate(formData.get("registration_ends")),
      cancellation_starts: parseOptionalDate(
        formData.get("cancellation_starts"),
      ),
      cancellation_ends: parseOptionalDate(formData.get("cancellation_ends")),
      location: parseOptionalText(formData.get("venue")),
      category: parseOptionalText(formData.get("event_type")),
      description: parseOptionalText(formData.get("description")),
      alcohol_meter: parseOptionalNumber(formData.get("alcohol_scale")),
      price: parseOptionalText(formData.get("price")),
      map: parseOptionalText(formData.get("map_link")),
      max_participants: parseOptionalNumber(formData.get("max_participants")),
      membership_required: parseCheckbox(formData.get("membership_required")),
      outsiders_allowed: parseCheckbox(formData.get("can_participate")),
      template: parseCheckbox(formData.get("save_as_template")),
      responsible: parseOptionalText(formData.get("organizer")),
      show_responsible: parseCheckbox(formData.get("show_contact")),
      avec: parseCheckbox(formData.get("avec")),
      deleted: false,
    }

    const response = await fetch(`${baseUrl}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Token": token } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    console.log("Response, ", response)

    if (!response.ok) {
      throw new Error(`Event creation failed with status ${response.status}`)
    }
  }

  return (
    <main className={styles.main}>
      <PageHeader title={t("luoTapahtuma.title")}>
        {t("luoTapahtuma.descriptionPre")}{" "}
        <i>{t("luoTapahtuma.descriptionEm")}</i>{" "}
        {t("luoTapahtuma.descriptionSuf")}{" "}
        <a href="#" className={styles.link}>
          {t("luoTapahtuma.descriptionLink")}
        </a>
      </PageHeader>

      <section className={styles.section}>
        {/* Template picker */}
        <div className={styles.templateSection}>
          <FieldSelect id="template" label={t("luoTapahtuma.templateLabel")}>
            <option value="">{t("luoTapahtuma.templatePlaceholder")}</option>
          </FieldSelect>
        </div>

        <form id="new-event-form" action={createEvent} className={styles.form}>
          {/* Required details */}
          <Fieldset legend={t("luoTapahtuma.required.legend")}>
            <Field
              required
              label={t("luoTapahtuma.required.name")}
              id="name"
              name="name"
              type="text"
            />
            <Field
              required
              label={t("luoTapahtuma.required.date")}
              id="date"
              name="date"
              type="date"
            />
            <Field
              required
              label={t("luoTapahtuma.required.time")}
              id="time"
              name="time"
              type="time"
            />

            <Field
              required
              label={t("luoTapahtuma.required.venue")}
              id="venue"
              name="venue"
              type="text"
              list="venue-datalist"
              placeholder={t("luoTapahtuma.required.venuePlaceholder")}
            />
            <datalist id="venue-datalist">
              <option value="Paikka 1" />
              <option value="Paikka 2" />
              <option value="Paikka 3" />
            </datalist>

            <Field
              required
              label={t("luoTapahtuma.required.eventType")}
              id="event_type"
              name="event_type"
              type="text"
              placeholder={t("luoTapahtuma.required.eventTypePlaceholder")}
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
              label={t("luoTapahtuma.required.description")}
              name="description"
              rows={5}
            />
          </Fieldset>

          {/* Optional details */}
          <Fieldset legend={t("luoTapahtuma.optional.legend")}>
            <Field
              label={t("luoTapahtuma.optional.organizer")}
              id="organizer"
              name="organizer"
              type="text"
            />
            <Field
              label={t("luoTapahtuma.optional.organizerUrl")}
              id="organizer_url"
              name="organizer_url"
              type="url"
            />
            <Field
              label={t("luoTapahtuma.optional.contactName")}
              id="contact_name"
              name="contact_name"
              type="text"
            />
            <Checkbox
              id="show_contact"
              name="show_contact"
              label={t("luoTapahtuma.optional.showContact")}
            />

            <FieldRadioGroup
              legend={t("luoTapahtuma.optional.paymentLegend")}
              name="payment"
              options={[
                { value: "paid", label: t("luoTapahtuma.optional.paid") },
                {
                  value: "free",
                  label: t("luoTapahtuma.optional.free"),
                  defaultChecked: true,
                },
              ]}
            />

            <Field
              label={t("luoTapahtuma.optional.price")}
              id="price"
              name="price"
              type="text"
            />
            <Field
              label={t("luoTapahtuma.optional.mapLink")}
              id="map_link"
              name="map_link"
              type="url"
            />

            <FieldSelect
              id="alcohol_scale"
              name="alcohol_scale"
              label={t("luoTapahtuma.optional.alcoholScale")}
            >
              <option value="">
                {t("luoTapahtuma.optional.alcoholSelectDefault")}
              </option>
              <option value="0">
                {t("luoTapahtuma.optional.alcoholNone")}
              </option>
              <option value="1">
                {t("luoTapahtuma.optional.alcoholLevel1")}
              </option>
              <option value="2">
                {t("luoTapahtuma.optional.alcoholLevel2")}
              </option>
              <option value="3">
                {t("luoTapahtuma.optional.alcoholModerate")}
              </option>
              <option value="4">
                {t("luoTapahtuma.optional.alcoholLevel4")}
              </option>
              <option value="5">
                {t("luoTapahtuma.optional.alcoholHeavy")}
              </option>
            </FieldSelect>

            <div className={styles.checkboxList}>
              <Checkbox
                id="can_participate"
                name="can_participate"
                label={t("luoTapahtuma.optional.canParticipate")}
              />
              <Checkbox
                id="membership_required"
                name="membership_required"
                label={t("luoTapahtuma.optional.membershipRequired")}
              />
              <Checkbox
                id="avec"
                name="avec"
                label={t("luoTapahtuma.optional.avec")}
              />
            </div>

            <Field
              label={t("luoTapahtuma.optional.maxParticipants")}
              id="max_participants"
              name="max_participants"
              type="number"
              min="0"
            />
            <Field
              label={t("luoTapahtuma.optional.registrationStarts")}
              id="registration_starts"
              name="registration_starts"
              type="datetime-local"
            />
            <Field
              label={t("luoTapahtuma.optional.registrationEnds")}
              id="registration_ends"
              name="registration_ends"
              type="datetime-local"
            />

            <Alert>{t("luoTapahtuma.optional.cancellationAlert")}</Alert>

            <Field
              label={t("luoTapahtuma.optional.cancellationStarts")}
              id="cancellation_starts"
              name="cancellation_starts"
              type="datetime-local"
            />
            <Field
              label={t("luoTapahtuma.optional.cancellationEnds")}
              id="cancellation_ends"
              name="cancellation_ends"
              type="datetime-local"
            />

            <Checkbox
              id="save_as_template"
              name="save_as_template"
              label={t("luoTapahtuma.optional.saveAsTemplate")}
            />
          </Fieldset>
        </form>
      </section>

      <CallToActionButton form="new-event-form">
        {t("luoTapahtuma.submit")}
      </CallToActionButton>
    </main>
  )
}

export default AddEventPage
