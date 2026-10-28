"use client"

import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import Textarea from "@/components/Textarea/Textarea"
import TemplatePicker from "./luo/TemplatePicker"
import type {
  Event,
  RegistrationQuota,
  EventFormValues,
} from "./types"
import styles from "./luo/LuoTapahtuma.module.css"
import { useId } from "react"
import { useTranslation } from "@/app/i18n/client"

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

const RadioOptionFields = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const { control, register } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex" }}>
          <Field
            label={t("luoTapahtuma.customField.option")}
            id={`${name}_${index}`}
            type="text"
            {...register(`${name}.${index}.value`)}
          />
          {fields.length !== 1 && (
            <button onClick={() => remove(index)} type="button">
              -
            </button>
          )}
        </div>
      ))}
      <button onClick={() => append({ value: "" })} type="button">
        +
      </button>
    </>
  )
}

const CustomFieldsField = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const { control, register } = useFormContext()
  const id = useId()

  const type = useWatch({
    control,
    name: `${name}.type`,
  })

  return (
    <div>
      <FieldSelect
        id={`${id}_type`}
        label={t("luoTapahtuma.customField.type")}
        {...register(`${name}.type`)}
      >
        <option value="">{t("luoTapahtuma.customField.types.default")}</option>
        <option value="textarea">
          {t("luoTapahtuma.customField.types.textarea")}
        </option>
        <option value="text">{t("luoTapahtuma.customField.types.text")}</option>
        <option value="radio">
          {t("luoTapahtuma.customField.types.radio")}
        </option>
        <option value="checkbox">
          {t("luoTapahtuma.customField.types.checkbox")}
        </option>
      </FieldSelect>

      <Field
        label={t("luoTapahtuma.customField.question")}
        id={`${id}_name`}
        type="text"
        {...register(`${name}.translations.0.name`)}
      />

      {type === "radio" && <RadioOptionFields name={`${name}.options`} />}

      <Checkbox
        id={`${id}_required`}
        label={t("luoTapahtuma.customField.required")}
        {...register(`${name}.required`)}
      />
    </div>
  )
}

const CustomFieldsFieldForm = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <Fieldset legend={t("luoTapahtuma.customField.legend")}>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex" }}>
          <CustomFieldsField name={`${name}.${index}`} />

          <button onClick={() => remove(index)} type="button">
            -
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          append({
            type: "",
            translations: [{ locale: "", name: "" }],
          })
        }
        type="button"
      >
        {t("luoTapahtuma.customField.add")}
      </button>
    </Fieldset>
  )
}

const RegistrationQuotaField = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const { register } = useFormContext()

  const dateOptions = {
    setValueAs: (value: string) => (value ? new Date(value) : undefined),
  }

  return (
    <div>
      <Field
        label={t("luoTapahtuma.requestQuota.name")}
        id={`${name}_quota_name`}
        type="text"
        {...register(`${name}.translations.quota_name`)}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.maxParticipants")}
        id={`${name}_max_participants`}
        type="number"
        min="0"
        {...register(`${name}.max_participants`, {
          setValueAs: (value: string) =>
            value === "" ? undefined : Number(value),
        })}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.registrationStarts")}
        id={`${name}_registration_starts`}
        type="datetime-local"
        {...register(`${name}.registration_starts`, dateOptions)}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.registrationEnds")}
        id={`${name}_registration_ends`}
        type="datetime-local"
        {...register(`${name}.registration_ends`, dateOptions)}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.cancellationStarts")}
        id={`${name}_cancellation_starts`}
        type="datetime-local"
        {...register(`${name}.cancellation_starts`, dateOptions)}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.cancellationEnds")}
        id={`${name}_cancellation_ends`}
        type="datetime-local"
        {...register(`${name}.cancellation_ends`, dateOptions)}
      />

      <fieldset>
        <legend>{t("luoTapahtuma.requestQuota.paymentLegend")}</legend>

        <label>
          <input type="radio" value="paid" {...register(`${name}.payment`)} />
          {t("luoTapahtuma.requestQuota.paid")}
        </label>

        <label>
          <input type="radio" value="free" {...register(`${name}.payment`)} />
          {t("luoTapahtuma.requestQuota.free")}
        </label>
      </fieldset>

      <Field
        label={t("luoTapahtuma.optional.price")}
        id={`${name}_price`}
        type="number"
        step="0.01"
        min="0"
        {...register(`${name}.price`, {
          setValueAs: (value: string) =>
            value === "" ? undefined : Number(value),
        })}
      />

      <div className={styles.checkboxList}>
        <Checkbox
          id={`${name}_outsiders_allowed`}
          label={t("luoTapahtuma.requestQuota.outsiders_allowed")}
          {...register(`${name}.outsiders_allowed`)}
        />
        <Checkbox
          id={`${name}_membership_required`}
          label={t("luoTapahtuma.requestQuota.membershipRequired")}
          {...register(`${name}.membership_required`)}
        />
        <Checkbox
          id={`${name}_avec_can_attend`}
          label={t("luoTapahtuma.requestQuota.avec")}
          {...register(`${name}.avec_can_attend`)}
        />
        <Checkbox
          id={`${name}_hidden`}
          label={t("luoTapahtuma.requestQuota.hidden")}
          {...register(`${name}.hidden`)}
        />
        <Field
          label={t("luoTapahtuma.requestQuota.is_main_quota")}
          id={`${name}_is_main_quota`}
          type="checkbox"
          {...register(`${name}.is_main_quota`)}
        />
      </div>

      <CustomFieldsFieldForm name={`${name}.fields`} />
    </div>
  )
}

const RegistrationQuotaForm = () => {
  const { t } = useTranslation()
  const { control, getValues } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "registrationQuotas",
  })

  const addRegistrationQuota = () => {
    const first = getValues("registrationQuotas.0")

    append({
      registration_starts: first?.registration_starts,
      registration_ends: first?.registration_ends,
      cancellation_starts: first?.cancellation_starts,
      cancellation_ends: first?.cancellation_ends,
    } as RegistrationQuota)
  }

  return (
    <Fieldset legend={t("luoTapahtuma.requestQuota.legend")}>
      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex" }}>
          <RegistrationQuotaField name={`registrationQuotas.${index}`} />

          <button onClick={() => remove(index)} type="button">
            -
          </button>
        </div>
      ))}

      <button onClick={addRegistrationQuota} type="button">
        {t("luoTapahtuma.requestQuota.add")}
      </button>
    </Fieldset>
  )
}

type Props = {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Event
  templates?: Event[]
  templateLabel?: string
  templatePlaceholder?: string
  submitLabel: string
  formId?: string
}

const EventForm = ({
  action,
  defaultValues,
  templates,
  templateLabel,
  templatePlaceholder,
  submitLabel,
  formId = "event-form",
}: Props) => {
  const { t } = useTranslation()

  const methods = useForm<EventFormValues>({})

  return (
    <section className={styles.section}>
      <FormProvider {...methods}>
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
          <Fieldset legend={t("luoTapahtuma.required.legend")}>
            <Field
              required
              label={t("luoTapahtuma.required.title")}
              id="title"
              type="text"
              {...methods.register("translations.0.title")}
            />

            <Field
              required
              label={t("luoTapahtuma.required.date")}
              id="date"
              type="date"
              {...methods.register("date")}
            />

            <Field
              required
              label={t("luoTapahtuma.required.time")}
              id="time"
              type="time"
              {...methods.register("time")}
            />

            <Field
              required
              label={t("luoTapahtuma.required.venue")}
              id="venue"
              type="text"
              list="venue-datalist"
              placeholder={t("luoTapahtuma.required.venuePlaceholder")}
              {...methods.register("location.translations.0.location")}
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
              type="text"
              placeholder={t("luoTapahtuma.required.eventTypePlaceholder")}
              list="event-type-datalist"
              {...methods.register("eventType.translations.0.event_type")}
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
              rows={5}
              {...methods.register("translations.0.description")}
            />

            <RegistrationQuotaForm />
          </Fieldset>

          <Fieldset legend={t("luoTapahtuma.optional.legend")}>
            <Field
              label={t("luoTapahtuma.optional.organizer")}
              id="responsible"
              type="text"
              {...methods.register("responsible")}
            />

            <Checkbox
              id="show_responsible"
              label={t("luoTapahtuma.optional.showContact")}
              {...methods.register("show_responsible")}
            />

            <Field
              label={t("luoTapahtuma.optional.mapLink")}
              id="map_link"
              type="url"
              {...methods.register("location.map_link")}
            />

            <FieldRadioGroup
              legend={t("luoTapahtuma.optional.paymentLegend")}
              options={[
                { value: "0", label: t("luoTapahtuma.optional.alcoholNone") },
                { value: "1", label: t("luoTapahtuma.optional.alcoholLevel1") },
                { value: "2", label: t("luoTapahtuma.optional.alcoholLevel2") },
                {
                  value: "3",
                  label: t("luoTapahtuma.optional.alcoholModerate"),
                },
                { value: "4", label: t("luoTapahtuma.optional.alcoholLevel4") },
                { value: "5", label: t("luoTapahtuma.optional.alcoholHeavy") },
              ]}
              {...methods.register("alcohol_meter")}
            />
          </Fieldset>
          <CustomFieldsFieldForm name="fields" />

          <Checkbox
            id="save_as_template"
            label={t("luoTapahtuma.optional.saveAsTemplate")}
            {...methods.register("template")}
          />
        </form>
      </FormProvider>

      <CallToActionButton form={formId}>{submitLabel}</CallToActionButton>
    </section>
  )
}

export default EventForm
