"use client"

import type { ChangeEvent } from "react"
import { useFormContext } from "react-hook-form"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import type { Event, EventFormValues } from "../types"
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
  const { reset, getValues } = useFormContext<EventFormValues>()

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tpl = templates.find(t => t.id === Number(e.target.value))
    if (!tpl) return

    const { id, starts, template, ...templateValues } = tpl

    reset({
      ...getValues(),
      ...templateValues,
      ...splitDateTime(starts.toLocaleDateString()),
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
