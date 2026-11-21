"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Alert from "@/components/Alert/Alert"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import Textarea from "@/components/Textarea/Textarea"
import TemplatePicker from "./luo/TemplatePicker"
import {
  LanguageTabs,
  TRANSLATION_INPUT_LANGUAGES,
  TranslationInput,
} from "./TranslationInput"
import {
  type Event,
  type RegistrationQuota,
  eventFormValuesSchema,
  EventFormInput,
  EventFormValues,
} from "./validators"
import styles from "./luo/LuoTapahtuma.module.css"
import { useTranslation } from "@/app/i18n/client"
import {
  get,
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useId, useState } from "react"

export const splitDateTime = (name: string, value?: string) => {
  if (!value)
    return { [`${name}_date`]: undefined, [`${name}_time`]: undefined }
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, "0")
  return {
    [`${name}_date`]: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    [`${name}_time`]: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

const FieldErrorMessage = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const { getFieldState, formState } = useFormContext()
  const { error } = getFieldState(name, formState)

  if (!error?.message) return null

  return <Alert>{t(error.message)}</Alert>
}

const TimeField = ({ name, legend }: { name: string; legend?: string }) => {
  const { t } = useTranslation()
  const { register } = useFormContext()

  return (
    <>
      {!!legend && <legend className={styles.legend}>{legend}</legend>}
      <Field
        required
        label={t("luoTapahtuma.date")}
        id="date"
        type="date"
        {...register(`${name}_date`)}
      />
      <FieldErrorMessage name={`${name}_date`} />

      <Field
        required
        label={t("luoTapahtuma.required.time")}
        id="time"
        type="time"
        {...register(`${name}_date`)}
      />
      <FieldErrorMessage name={`${name}_time`} />
    </>
  )
}

const RadioOptionFields = ({ name }: { name: string }) => {
  const { t } = useTranslation()
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()
  const [active, setActive] = useState(0)

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const hasError = (langIndex: number) =>
    fields.some(
      (_, index) =>
        !!get(errors, `${name}.${index}.translations.${langIndex}.value`),
    )

  return (
    <>
      <LanguageTabs active={active} onChange={setActive} hasError={hasError} />

      {fields.map((field, index) => (
        <div key={field.id} style={{ display: "flex" }}>
          <div>
            {TRANSLATION_INPUT_LANGUAGES.map((lang, langIndex) => {
              const base = `${name}.${index}.translations.${langIndex}`
              return (
                <div key={lang.code} hidden={active !== langIndex}>
                  <input
                    type="hidden"
                    defaultValue={lang.code}
                    {...register(`${base}.locale`)}
                  />
                  <Field
                    label={t("luoTapahtuma.customField.option")}
                    id={`${base}.value`}
                    type="text"
                    {...register(`${base}.options`)}
                  />
                  <FieldErrorMessage name={`${base}.value`} />
                </div>
              )
            })}
          </div>

          {fields.length !== 1 && (
            <button onClick={() => remove(index)} type="button">
              -
            </button>
          )}
        </div>
      ))}

      <button
        onClick={() =>
          append({
            translations: TRANSLATION_INPUT_LANGUAGES.map(lang => ({
              locale: lang.code,
              value: "",
            })),
          })
        }
        type="button"
      >
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
      <FieldErrorMessage name={`${name}.type`} />

      <TranslationInput
        name="translations"
        field="name"
        render={props => (
          <Field
            label={t("luoTapahtuma.customField.question")}
            id={`${id}_name`}
            type="text"
            {...props}
          />
        )}
      />

      {type === "radio" && <RadioOptionFields name={`${name}.options`} />}

      <Checkbox
        id={`${id}_required`}
        label={t("luoTapahtuma.customField.required")}
        {...register(`${name}.required`)}
      />
      <FieldErrorMessage name={`${name}.required`} />
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
  const { register, control } = useFormContext()

  const dateOptions = {
    setValueAs: (value: string) => (value ? new Date(value) : undefined),
  }

  const isPaid = useWatch({ control, name: `${name}.isPaid` })

  return (
    <div>
      <TranslationInput
        name={`${name}.translations`}
        field="quota_name"
        render={props => (
          <Field
            label={t("luoTapahtuma.requestQuota.name")}
            id={`${name}_quota_name`}
            type="text"
            {...props}
          />
        )}
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
      <FieldErrorMessage name={`${name}.max_participants`} />

      <Field
        label={t("luoTapahtuma.requestQuota.registrationStarts")}
        id={`${name}_registration_starts`}
        type="datetime-local"
        {...register(`${name}.registration_starts`, dateOptions)}
      />
      <FieldErrorMessage name={`${name}.registration_starts`} />

      <Field
        label={t("luoTapahtuma.requestQuota.registrationEnds")}
        id={`${name}_registration_ends`}
        type="datetime-local"
        {...register(`${name}.registration_ends`, dateOptions)}
      />
      <FieldErrorMessage name={`${name}.registration_ends`} />

      <Field
        label={t("luoTapahtuma.requestQuota.cancellationStarts")}
        id={`${name}_cancellation_starts`}
        type="datetime-local"
        {...register(`${name}.cancellation_starts`, dateOptions)}
      />
      <FieldErrorMessage name={`${name}.cancellation_starts`} />

      <Field
        label={t("luoTapahtuma.requestQuota.cancellationEnds")}
        id={`${name}_cancellation_ends`}
        type="datetime-local"
        {...register(`${name}.cancellation_ends`, dateOptions)}
      />
      <FieldErrorMessage name={`${name}.cancellation_ends`} />

      <FieldRadioGroup
        legend={t("luoTapahtuma.optional.paymentLegend")}
        options={[
          {
            value: "paid",
            label: t("luoTapahtuma.optional.paid"),
          },
          {
            value: "free",
            label: t("luoTapahtuma.optional.free"),
          },
        ]}
        {...register(`${name}.isPaid`)}
      />

      {isPaid === "paid" && (
        <>
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
          <FieldErrorMessage name={`${name}.price`} />
        </>
      )}

      <div className={styles.checkboxList}>
        <Checkbox
          id={`${name}_outsiders_allowed`}
          label={t("luoTapahtuma.requestQuota.outsiders_allowed")}
          {...register(`${name}.outsiders_allowed`)}
        />
        <FieldErrorMessage name={`${name}.outsiders_allowed`} />

        <Checkbox
          id={`${name}_membership_required`}
          label={t("luoTapahtuma.requestQuota.membershipRequired")}
          {...register(`${name}.membership_required`)}
        />
        <FieldErrorMessage name={`${name}.outsiders_allowed`} />

        <Checkbox
          id={`${name}_avec_can_attend`}
          label={t("luoTapahtuma.requestQuota.avec")}
          {...register(`${name}.avec_can_attend`)}
        />
        <FieldErrorMessage name={`${name}.avec_can_attend`} />

        <Checkbox
          id={`${name}_hidden`}
          label={t("luoTapahtuma.requestQuota.hidden")}
          {...register(`${name}.hidden`)}
        />
        <FieldErrorMessage name={`${name}.avec_can_attend`} />

        <Field
          label={t("luoTapahtuma.requestQuota.is_main_quota")}
          id={`${name}_is_main_quota`}
          type="checkbox"
          {...register(`${name}.is_main_quota`)}
        />
        <FieldErrorMessage name={`${name}.avec_can_attend`} />
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
  onSubmit: (formData: EventFormValues) => Promise<void>
  defaultValues?: Event
  templates?: Event[]
  templateLabel?: string
  templatePlaceholder?: string
  submitLabel: string
  locale: string
  formId?: string
}

const EventForm = ({
  onSubmit,
  defaultValues,
  templates,
  templateLabel,
  templatePlaceholder,
  submitLabel,
  locale,
  formId = "event-form",
}: Props) => {
  const { t } = useTranslation()
  const { starts, weekly_event_end_time, publishing_time, ...restDefaults } =
    defaultValues ?? {}

  const methods = useForm<EventFormInput, unknown, EventFormValues>({
    defaultValues: {
      ...restDefaults,
      ...splitDateTime("starts", starts?.toLocaleDateString()),
      ...splitDateTime(
        "weeklyEventEnd",
        weekly_event_end_time?.toLocaleDateString(),
      ),
      ...splitDateTime("publish", publishing_time?.toLocaleDateString()),
    },
    resolver: zodResolver(eventFormValuesSchema),
  })

  const [isRegistration, show_responsible, weekly_event] = useWatch({
    control: methods.control,
    name: ["isRegistration", "show_responsible", "weekly_event"],
  })

  return (
    <section className={styles.section}>
      <FormProvider {...methods}>
        {templates && templateLabel && templatePlaceholder && (
          <div className={styles.templateSection}>
            <TemplatePicker
              templates={templates}
              label={templateLabel}
              placeholder={templatePlaceholder}
              locale={locale}
            />
          </div>
        )}

        <form
          id={formId}
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Fieldset legend={t("luoTapahtuma.required.legend")}>
            <TranslationInput
              name="translations"
              field="title"
              render={props => (
                <Field
                  required
                  label={t("luoTapahtuma.required.title")}
                  id="title"
                  type="text"
                  {...props}
                />
              )}
            />

            <TimeField name="starts" />

            <Field
              required
              label={t("luoTapahtuma.required.venue")}
              id="venue"
              type="text"
              list="venue-datalist"
              placeholder={t("luoTapahtuma.required.venuePlaceholder")}
              {...methods.register("location.translations.0.location")}
            />
            <FieldErrorMessage name="location" />

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
            <FieldErrorMessage name="eventType" />

            <datalist id="event-type-datalist">
              <option value="Tyyppi 1" />
              <option value="Tyyppi 2" />
              <option value="Tyyppi 3" />
            </datalist>

            <TranslationInput
              name="translations"
              field="description"
              render={props => (
                <Textarea
                  required
                  id="description"
                  label={t("luoTapahtuma.required.description")}
                  rows={5}
                  {...props}
                />
              )}
            />
          </Fieldset>

          <Fieldset legend={t("luoTapahtuma.optional.legend")}>
            <Checkbox
              id="show_responsible"
              label={t("luoTapahtuma.optional.showResponsible")}
              {...methods.register("show_responsible")}
            />
            <FieldErrorMessage name="show_responsible" />

            {show_responsible && (
              <>
                <Field
                  label={t("luoTapahtuma.optional.responsible")}
                  id="responsible"
                  type="text"
                  {...methods.register("responsible")}
                />
                <FieldErrorMessage name="responsible" />
              </>
            )}

            <Checkbox
              id="weekly_event"
              label={t("luoTapahtuma.optional.isWeeklyEvent")}
              {...methods.register("weekly_event")}
            />
            {weekly_event && (
              <TimeField
                legend={t("luoTapahtuma.optional.weeklyEventEndTime")}
                name="weeklyEventEnd"
              />
            )}

            <TimeField
              legend={t("luoTapahtuma.optional.publishingTime")}
              name="publish"
            />

            <Field
              label={t("luoTapahtuma.optional.mapLink")}
              id="map_link"
              type="url"
              {...methods.register("location.map_link")}
            />
            <FieldErrorMessage name="location.map_link" />

            <FieldRadioGroup
              legend={t("luoTapahtuma.optional.alcoholMeter")}
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
            <FieldErrorMessage name="alcohol_meter" />

            <FieldRadioGroup
              legend={t("luoTapahtuma.optional.registrationLegend")}
              options={[
                {
                  value: "yes",
                  label: t("luoTapahtuma.optional.yes"),
                },
                {
                  value: "no",
                  label: t("luoTapahtuma.optional.no"),
                },
              ]}
              {...methods.register("isRegistration")}
            />
            <FieldErrorMessage name="isRegistration" />
          </Fieldset>

          {isRegistration === "yes" && <RegistrationQuotaForm />}
          <CustomFieldsFieldForm name="fields" />

          <Checkbox
            id="save_as_template"
            label={t("luoTapahtuma.optional.saveAsTemplate")}
            {...methods.register("template")}
          />
          <FieldErrorMessage name="template" />
        </form>
      </FormProvider>

      <CallToActionButton form={formId}>{submitLabel}</CallToActionButton>
    </section>
  )
}

export default EventForm
