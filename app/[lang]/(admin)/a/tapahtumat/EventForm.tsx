import Alert from "@/components/Alert/Alert"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import Textarea from "@/components/Textarea/Textarea"
import TemplatePicker from "./luo/TemplatePicker"
import type { EventFormValues } from "./types"
import styles from "./luo/LuoTapahtuma.module.css"

export const toDateInputValue = (iso: string | null | undefined): string => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
}

export const toTimeInputValue = (iso: string | null | undefined): string => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(11, 16)
}

export const toDateTimeLocalValue = (
  iso: string | null | undefined,
): string => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16)
}

type Props = {
  action: (formData: FormData) => Promise<void>
  defaultValues?: EventFormValues
  templates?: EventFormValues[]
  templateLabel?: string
  templatePlaceholder?: string
  t: (key: string) => string
  submitLabel: string
  formId?: string
}

const EventForm = ({
  action,
  defaultValues,
  templates,
  templateLabel,
  templatePlaceholder,
  t,
  submitLabel,
  formId = "event-form",
}: Props) => {
  const isPaid = !!defaultValues?.price

  return (
    <section className={styles.section}>
      {templates && templateLabel && templatePlaceholder && (
        <div className={styles.templateSection}>
          <TemplatePicker
            templates={templates}
            label={templateLabel}
            placeholder={templatePlaceholder}
          />
        </div>
      )}

      <form id={formId} action={action} className={styles.form}>
        {/* Required details */}
        <Fieldset legend={t("luoTapahtuma.required.legend")}>
          <Field
            required
            label={t("luoTapahtuma.required.name")}
            id="name"
            name="name"
            type="text"
            defaultValue={defaultValues?.name}
          />
          <Field
            required
            label={t("luoTapahtuma.required.date")}
            id="date"
            name="date"
            type="date"
            defaultValue={toDateInputValue(defaultValues?.starts)}
          />
          <Field
            required
            label={t("luoTapahtuma.required.time")}
            id="time"
            name="time"
            type="time"
            defaultValue={toTimeInputValue(defaultValues?.starts)}
          />

          <Field
            required
            label={t("luoTapahtuma.required.venue")}
            id="venue"
            name="venue"
            type="text"
            list="venue-datalist"
            placeholder={t("luoTapahtuma.required.venuePlaceholder")}
            defaultValue={defaultValues?.location ?? ""}
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
            defaultValue={defaultValues?.category ?? ""}
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
            defaultValue={defaultValues?.description ?? ""}
          />
        </Fieldset>

        {/* Optional details */}
        <Fieldset legend={t("luoTapahtuma.optional.legend")}>
          <Field
            label={t("luoTapahtuma.optional.organizer")}
            id="organizer"
            name="organizer"
            type="text"
            defaultValue={defaultValues?.responsible ?? ""}
          />
          <Checkbox
            id="show_contact"
            name="show_contact"
            label={t("luoTapahtuma.optional.showContact")}
            defaultChecked={defaultValues?.show_responsible ?? false}
          />

          <FieldRadioGroup
            legend={t("luoTapahtuma.optional.paymentLegend")}
            name="payment"
            options={[
              {
                value: "paid",
                label: t("luoTapahtuma.optional.paid"),
                defaultChecked: isPaid,
              },
              {
                value: "free",
                label: t("luoTapahtuma.optional.free"),
                defaultChecked: !isPaid,
              },
            ]}
          />

          <Field
            label={t("luoTapahtuma.optional.price")}
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.price ?? ""}
          />
          <Field
            label={t("luoTapahtuma.optional.mapLink")}
            id="map_link"
            name="map_link"
            type="url"
            defaultValue={defaultValues?.map ?? ""}
          />

          <FieldSelect
            id="alcohol_scale"
            name="alcohol_scale"
            label={t("luoTapahtuma.optional.alcoholScale")}
            defaultValue={
              defaultValues?.alcohol_meter != null
                ? String(defaultValues.alcohol_meter)
                : ""
            }
          >
            <option value="">
              {t("luoTapahtuma.optional.alcoholSelectDefault")}
            </option>
            <option value="0">{t("luoTapahtuma.optional.alcoholNone")}</option>
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
            <option value="5">{t("luoTapahtuma.optional.alcoholHeavy")}</option>
          </FieldSelect>

          <div className={styles.checkboxList}>
            <Checkbox
              id="can_participate"
              name="can_participate"
              label={t("luoTapahtuma.optional.canParticipate")}
              defaultChecked={defaultValues?.outsiders_allowed ?? false}
            />
            <Checkbox
              id="membership_required"
              name="membership_required"
              label={t("luoTapahtuma.optional.membershipRequired")}
              defaultChecked={defaultValues?.membership_required ?? false}
            />
            <Checkbox
              id="avec"
              name="avec"
              label={t("luoTapahtuma.optional.avec")}
              defaultChecked={defaultValues?.avec ?? false}
            />
          </div>

          <Field
            label={t("luoTapahtuma.optional.maxParticipants")}
            id="max_participants"
            name="max_participants"
            type="number"
            min="0"
            defaultValue={
              defaultValues?.max_participants != null
                ? String(defaultValues.max_participants)
                : ""
            }
          />
          <Field
            label={t("luoTapahtuma.optional.registrationStarts")}
            id="registration_starts"
            name="registration_starts"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(
              defaultValues?.registration_starts,
            )}
          />
          <Field
            label={t("luoTapahtuma.optional.registrationEnds")}
            id="registration_ends"
            name="registration_ends"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(
              defaultValues?.registration_ends,
            )}
          />

          <Alert>{t("luoTapahtuma.optional.cancellationAlert")}</Alert>

          <Field
            label={t("luoTapahtuma.optional.cancellationStarts")}
            id="cancellation_starts"
            name="cancellation_starts"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(
              defaultValues?.cancellation_starts,
            )}
          />
          <Field
            label={t("luoTapahtuma.optional.cancellationEnds")}
            id="cancellation_ends"
            name="cancellation_ends"
            type="datetime-local"
            defaultValue={toDateTimeLocalValue(
              defaultValues?.cancellation_ends,
            )}
          />

          <Checkbox
            id="save_as_template"
            name="save_as_template"
            label={t("luoTapahtuma.optional.saveAsTemplate")}
          />
        </Fieldset>
      </form>

      <CallToActionButton form={formId}>{submitLabel}</CallToActionButton>
    </section>
  )
}

export default EventForm
