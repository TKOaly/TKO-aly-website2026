"use client"

import type { ChangeEvent } from "react"
import { useFormContext } from "react-hook-form"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import type { Event, EventFormInput, EventFormValues } from "../validators"
import { splitDateTime } from "../EventForm"
import { useTranslation } from "@/app/i18n/client"

type Props = {
  templates: Event[]
  label: string
  placeholder: string
  locale: string
}

const getTitle = (tpl: Event, locale?: string) =>
  tpl.translations.find(t => t.locale === locale)?.title ??
  tpl.translations[0]?.title

const TemplatePicker = ({ templates, label, placeholder, locale }: Props) => {
  const { t } = useTranslation()
  const { reset, getValues } = useFormContext<
    EventFormInput,
    unknown,
    EventFormValues
  >()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tpl = templates.find(t => t.id === Number(e.target.value))
    if (!tpl) return

    const {
      starts,
      weekly_event_end_time,
      publishing_time,
      ...templateValues
    } = tpl

    reset({
      ...getValues(),
      ...templateValues,
      ...splitDateTime("starts", starts?.toLocaleDateString()),
      ...splitDateTime(
        "weeklyEventEnd",
        weekly_event_end_time?.toLocaleDateString(),
      ),
      ...splitDateTime("publish", publishing_time?.toLocaleDateString()),
      template: false,
    })
  }

  return (
    <FieldSelect id="template" label={label} onChange={handleChange}>
      <option value="">{placeholder}</option>
      {templates.map(tpl => (
        <option key={tpl.id} value={tpl.id}>
          {`${getTitle(tpl, locale)} [${t("luoTapahtuma.template")}]`}
        </option>
      ))}
    </FieldSelect>
  )
}

export default TemplatePicker
