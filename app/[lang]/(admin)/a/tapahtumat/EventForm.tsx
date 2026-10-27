"use client"

import { For } from "@chakra-ui/react"
import CallToActionButton from "@/components/Buttons/CallToActionButton"
import Checkbox from "@/components/Checkbox/Checkbox"
import Field from "@/components/Field/Field"
import Fieldset from "@/components/Fieldset/Fieldset"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import FieldRadioGroup from "@/components/FieldRadioGroup/FieldRadioGroup"
import Textarea from "@/components/Textarea/Textarea"
import TemplatePicker from "./luo/TemplatePicker"
import type {
  EventFormValues,
  RegistrationQuota,
  CustomField,
  ListItem,
} from "./types"
import styles from "./luo/LuoTapahtuma.module.css"
import { useEffect, useId, useRef, useState } from "react"
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

const RadioOptionFields = ({
  id,
  onChange,
}: {
  id: string
  onChange?: (options: string[]) => void
}) => {
  const { t } = useTranslation()
  const [radioOptions, setRadioOptions] = useState<ListItem<string>[]>([
    { id: 0, value: "" },
  ])
  const nextId = useRef(1)

  useEffect(() => {
    onChange?.(radioOptions.map(option => option.value))
  }, [radioOptions])

  const addRadioOption = () => {
    setRadioOptions(prev => [...prev, { id: nextId.current, value: "" }])
    nextId.current++
  }

  const removeRadioOption = (id: number) => {
    setRadioOptions(prev => prev.filter(option => option.id !== id))
  }

  const updateRadioOption = (id: number, value: string) => {
    setRadioOptions(prev =>
      prev.map(option => (option.id === id ? { ...option, value } : option)),
    )
  }

  return (
    <>
      {radioOptions.map((option, index) => (
        <div key={option.id} style={{ display: "flex" }}>
          <Field
            label={t("luoTapahtuma.customField.option")}
            id={`${id}_${index}`}
            name={`customFieldOption_${index}`}
            value={option.value}
            type="text"
            onChange={e => updateRadioOption(option.id, e.target.value)}
          />
          {radioOptions.length !== 1 && (
            <button
              onClick={() => removeRadioOption(option.id)}
              className={styles.addButton}
              type="button"
            >
              -
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addRadioOption}
        className={styles.addButton}
        type="button"
      >
        +
      </button>
    </>
  )
}

const CustomFieldsField = ({
  defaultValues,
  onChange,
}: {
  defaultValues?: CustomField
  onChange?: (customField: CustomField) => void
}) => {
  const { t } = useTranslation()
  const uuid = useId()

  const [customField, setCustomField] = useState<Partial<CustomField>>(
    defaultValues ?? { type: "", required: false, translations: [] },
  )

  const update = (patch: Partial<CustomField>) => {
    const next: CustomField = { ...customField, ...patch }
    setCustomField(next)
    onChange?.(next)
  }

  return (
    <div>
      <FieldSelect
        id={`${uuid}_type`}
        label={t("luoTapahtuma.customField.type")}
        defaultValue={defaultValues?.type ?? ""}
        onChange={e => update({ type: e.target.value as CustomField["type"] })}
      >
        <option value="">{t("luoTapahtuma.customField.types.default")}</option>
        <option
          value="textarea"
          label={t("luoTapahtuma.customField.types.textarea")}
        />
        <option value="text" label={t("luoTapahtuma.customField.types.text")} />
        <option
          value="radio"
          label={t("luoTapahtuma.customField.types.radio")}
        />
        <option
          value="checkbox"
          label={t("luoTapahtuma.customField.types.checkbox")}
        />
      </FieldSelect>

      <Field
        label={t("luoTapahtuma.customField.question")}
        id={`${uuid}_name`}
        type="text"
        defaultValue={defaultValues?.translations?.at(0)?.name}
        onChange={e =>
          update({
            translations: [
              { ...customField.translations?.at(0), name: e.target.value },
              ...(customField.translations?.slice(1) ?? []),
            ] as CustomField["translations"],
          })
        }
      />

      {customField.type === "radio" && (
        <RadioOptionFields
          id={`${uuid}_options`}
          onChange={options => update({ options } as Partial<CustomField>)}
        />
      )}

      <Checkbox
        id={`${uuid}_required`}
        label={t("luoTapahtuma.customField.required")}
        defaultChecked={defaultValues?.required ?? false}
        onChange={e => update({ required: e.target.checked })}
      />
    </div>
  )
}

const CustomFieldsFieldFrom = ({
  defaultValues,
  onChange,
}: {
  defaultValues?: CustomField[]
  onChange?: (fields: CustomField[]) => void
}) => {
  const { t } = useTranslation()
  const [customFieldsData, setCustomFields] = useState<ListItem<CustomField>[]>(
    defaultValues
      ? defaultValues.map((field, id) => ({ id, value: field }))
      : [],
  )

  useEffect(() => {
    onChange?.(customFieldsData.map(item => item.value))
  }, [customFieldsData])

  const nextCustomFieldId = useRef(customFieldsData.length)

  const addCustomFields = () => {
    setCustomFields(prev => [
      ...prev,
      {
        id: nextCustomFieldId.current,
        value: {
          type: "",
          translations: [{ locale: "", name: "" }],
        },
      },
    ])
    nextCustomFieldId.current++
  }

  const removeCustomFields = (id: number) => {
    setCustomFields(prev => prev.filter(field => field.id !== id))
  }

  const updateCustomFields = (id: number, value: CustomField) => {
    setCustomFields(prev =>
      prev.map(field => (field.id === id ? { ...field, value } : field)),
    )
  }

  return (
    <Fieldset legend={t("luoTapahtuma.customField.legend")}>
      <For each={customFieldsData}>
        {item => (
          <div key={item.id} style={{ display: "flex" }}>
            <CustomFieldsField
              defaultValues={item.value}
              onChange={field => updateCustomFields(item.id, field)}
            />
            <button onClick={() => removeCustomFields(item.id)} type="button">
              -
            </button>
          </div>
        )}
      </For>

      <button onClick={addCustomFields} type="button">
        {t("luoTapahtuma.customField.add")}
      </button>

      {onChange && (
        <input
          type="hidden"
          name="custom_fields"
          value={JSON.stringify(customFieldsData.map(f => f.value))}
        />
      )}
    </Fieldset>
  )
}

const RegistrationQuotaField = ({
  defaultValues,
  onChange,
}: {
  defaultValues?: RegistrationQuota
  onChange?: (registrationQuota: RegistrationQuota) => void
}) => {
  const { t } = useTranslation()
  const uuid = useId()
  const isPaid = !!defaultValues?.price
  const [registrationQuota, setRegistrationQuota] = useState<
    Partial<RegistrationQuota>
  >(defaultValues ?? {})

  const update = (patch: Partial<RegistrationQuota>) => {
    const next = { ...registrationQuota, ...patch }
    setRegistrationQuota(next)
    onChange?.(next as RegistrationQuota)
  }

  const toDate = (value: string) => (value ? new Date(value) : undefined)

  return (
    <div>
      <Field
        label={t("luoTapahtuma.requestQuota.name")}
        id={`${uuid}_quota_name`}
        type="text"
        defaultValue={defaultValues?.translations?.quota_name}
        onChange={e => update({ registration_starts: toDate(e.target.value) })}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.maxParticipants")}
        id="max_participants"
        type="number"
        min="0"
        defaultValue={
          defaultValues?.max_participants != null
            ? String(defaultValues.max_participants)
            : ""
        }
        onChange={e =>
          update({
            max_participants:
              e.target.value === "" ? undefined : Number(e.target.value),
          })
        }
      />
      <Field
        label={t("luoTapahtuma.requestQuota.registrationStarts")}
        id={`${uuid}_registration_starts`}
        type="datetime-local"
        defaultValue={defaultValues?.registration_starts?.toLocaleDateString()}
        onChange={e => update({ registration_starts: toDate(e.target.value) })}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.registrationEnds")}
        id={`${uuid}_registration_ends`}
        type="datetime-local"
        defaultValue={toDateTimeLocalValue(
          defaultValues?.registration_ends?.toLocaleDateString(),
        )}
        onChange={e => update({ registration_ends: toDate(e.target.value) })}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.cancellationStarts")}
        id={`${uuid}_cancellation_starts`}
        type="datetime-local"
        defaultValue={defaultValues?.cancellation_starts?.toLocaleDateString()}
        onChange={e => update({ cancellation_starts: toDate(e.target.value) })}
      />
      <Field
        label={t("luoTapahtuma.requestQuota.cancellationEnds")}
        id={`${uuid}_cancellation_ends`}
        type="datetime-local"
        defaultValue={defaultValues?.cancellation_ends?.toLocaleDateString()}
        onChange={e => update({ cancellation_ends: toDate(e.target.value) })}
      />

      <FieldRadioGroup
        legend={t("luoTapahtuma.requestQuota.paymentLegend")}
        name={`${uuid}_payment`}
        options={[
          {
            value: "paid",
            label: t("luoTapahtuma.requestQuota.paid"),
            defaultChecked: isPaid,
          },
          {
            value: "free",
            label: t("luoTapahtuma.requestQuota.free"),
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

      <div className={styles.checkboxList}>
        <Checkbox
          id={`${uuid}_outsiders_allowed`}
          label={t("luoTapahtuma.requestQuota.outsiders_allowed")}
          defaultChecked={defaultValues?.outsiders_allowed ?? false}
          onChange={e => update({ outsiders_allowed: e.target.checked })}
        />
        <Checkbox
          id={`${uuid}_membership_required`}
          label={t("luoTapahtuma.requestQuota.membershipRequired")}
          defaultChecked={defaultValues?.membership_required ?? false}
          onChange={e => update({ membership_required: e.target.checked })}
        />
        <Checkbox
          id={`${uuid}_avec_can_attend`}
          label={t("luoTapahtuma.requestQuota.avec")}
          defaultChecked={defaultValues?.avec_can_attend ?? false}
          onChange={e => update({ avec_can_attend: e.target.checked })}
        />
        <Checkbox
          id={`${uuid}_hidden`}
          label={t("luoTapahtuma.requestQuota.hidden")}
          defaultChecked={defaultValues?.hidden ?? false}
          onChange={e => update({ hidden: e.target.checked })}
        />
        <Field
          label={t("luoTapahtuma.requestQuota.is_main_quota")}
          id={`${uuid}_is_main_quota`}
          type="radio"
          name="main_quota"
          checked={!!defaultValues?.is_main_quota}
          onChange={e => update({ is_main_quota: e.target.checked })}
        />
      </div>

      <CustomFieldsFieldFrom
        defaultValues={defaultValues?.fields}
        onChange={fields => update({ fields: fields })}
      />
    </div>
  )
}

const RegistrationQuotaFrom = ({
  defaultValues,
  onChange,
}: {
  defaultValues?: RegistrationQuota[]
  onChange?: (fields: RegistrationQuota[]) => void
}) => {
  const { t } = useTranslation()
  const [customFieldsData, setCustomFields] = useState<
    ListItem<RegistrationQuota>[]
  >(
    defaultValues
      ? defaultValues.map((field, id) => ({ id, value: field }))
      : [],
  )

  useEffect(() => {
    onChange?.(customFieldsData.map(item => item.value))
  }, [customFieldsData])

  const nextRegistrationQuotaId = useRef(customFieldsData.length)

  const addRegistrationQuota = () => {
    setCustomFields(prev => {
      const first = prev[0]?.value

      return [
        ...prev,
        {
          id: nextRegistrationQuotaId.current,
          value: first
            ? {
                registration_starts: first.registration_starts,
                registration_ends: first.registration_ends,
                cancellation_starts: first.cancellation_starts,
                cancellation_ends: first.cancellation_ends,
              }
            : { id: nextRegistrationQuotaId.current, value: {} },
        },
      ]
    })
    nextRegistrationQuotaId.current++
  }

  const removeRegistrationQuota = (id: number) => {
    setCustomFields(prev => prev.filter(field => field.id !== id))
  }

  const updateRegistrationQuota = (id: number, value: RegistrationQuota) => {
    setCustomFields(prev =>
      prev.map(field => (field.id === id ? { ...field, value } : field)),
    )
  }

  return (
    <Fieldset legend={t("luoTapahtuma.requestQuota.legend")}>
      <For each={customFieldsData}>
        {item => (
          <div key={item.id} style={{ display: "flex" }}>
            <RegistrationQuotaField
              defaultValues={item.value}
              onChange={field => updateRegistrationQuota(item.id, field)}
            />
            <button
              onClick={() => removeRegistrationQuota(item.id)}
              type="button"
            >
              -
            </button>
          </div>
        )}
      </For>

      <button onClick={addRegistrationQuota} type="button">
        {t("luoTapahtuma.requestQuota.add")}
      </button>

      {onChange && (
        <input
          type="hidden"
          name="registration_quotas"
          value={JSON.stringify(customFieldsData.map(f => f.value))}
        />
      )}
    </Fieldset>
  )
}

type Props = {
  action: (formData: FormData) => Promise<void>
  defaultValues?: EventFormValues
  templates?: EventFormValues[]
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
            defaultValue={defaultValues?.translations.at(0)?.title}
          />
          <Field
            required
            label={t("luoTapahtuma.required.date")}
            id="date"
            name="date"
            type="date"
            defaultValue={toDateInputValue(defaultValues?.toLocaleString())}
          />
          <Field
            required
            label={t("luoTapahtuma.required.time")}
            id="time"
            name="time"
            type="time"
            defaultValue={defaultValues?.starts.toLocaleString()}
          />

          <Field
            required
            label={t("luoTapahtuma.required.venue")}
            id="venue"
            name="venue"
            type="text"
            list="venue-datalist"
            placeholder={t("luoTapahtuma.required.venuePlaceholder")}
            defaultValue={
              defaultValues?.location.translations.at(0)?.location ?? ""
            }
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
            defaultValue={
              defaultValues?.eventType.translations.at(0)?.event_type ?? ""
            }
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
            defaultValue={defaultValues?.translations.at(0)?.description ?? ""}
          />

          <RegistrationQuotaFrom
            defaultValues={defaultValues?.registrationQuotas}
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

          <Field
            label={t("luoTapahtuma.optional.mapLink")}
            id="map_link"
            name="map_link"
            type="url"
            defaultValue={defaultValues?.location.map_link ?? ""}
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
        </Fieldset>

        <CustomFieldsFieldFrom defaultValues={defaultValues?.fields} />

        <Checkbox
          id="save_as_template"
          name="save_as_template"
          label={t("luoTapahtuma.optional.saveAsTemplate")}
        />
      </form>

      <CallToActionButton form={formId}>{submitLabel}</CallToActionButton>
    </section>
  )
}

export default EventForm
