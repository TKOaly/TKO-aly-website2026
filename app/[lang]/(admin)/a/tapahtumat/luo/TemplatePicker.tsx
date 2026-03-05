"use client"

import type { ChangeEvent } from "react"
import FieldSelect from "@/components/FieldSelect/FieldSelect"
import type { EventFormValues } from "../types"

type Props = {
  templates: EventFormValues[]
  label: string
  placeholder: string
}

const toDateInputValue = (iso: string | null | undefined): string => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
}

const toTimeInputValue = (iso: string | null | undefined): string => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(11, 16)
}

const toDateTimeLocalValue = (iso: string | null | undefined): string => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16)
}

const setInputValue = (id: string, value: string) => {
  const el = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null
  if (el) el.value = value
}

const setCheckboxValue = (id: string, checked: boolean) => {
  const el = document.getElementById(id) as HTMLInputElement | null
  if (el) el.checked = checked
}

const TemplatePicker = ({ templates, label, placeholder }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    const tpl = templates.find(t => t.id === id)

    if (!tpl) return

    setInputValue("name", tpl.name)
    setInputValue("date", toDateInputValue(tpl.starts))
    setInputValue("time", toTimeInputValue(tpl.starts))
    setInputValue("venue", tpl.location ?? "")
    setInputValue("event_type", tpl.category ?? "")
    setInputValue("description", tpl.description ?? "")
    setInputValue("organizer", tpl.responsible ?? "")
    setInputValue("price", tpl.price != null ? String(tpl.price) : "")
    setInputValue("map_link", tpl.map ?? "")
    setInputValue(
      "alcohol_scale",
      tpl.alcohol_meter != null ? String(tpl.alcohol_meter) : "",
    )
    setInputValue(
      "max_participants",
      tpl.max_participants != null ? String(tpl.max_participants) : "",
    )
    setInputValue(
      "registration_starts",
      toDateTimeLocalValue(tpl.registration_starts),
    )
    setInputValue(
      "registration_ends",
      toDateTimeLocalValue(tpl.registration_ends),
    )
    setInputValue(
      "cancellation_starts",
      toDateTimeLocalValue(tpl.cancellation_starts),
    )
    setInputValue(
      "cancellation_ends",
      toDateTimeLocalValue(tpl.cancellation_ends),
    )

    setCheckboxValue("show_contact", tpl.show_responsible ?? false)
    setCheckboxValue("can_participate", tpl.outsiders_allowed ?? false)
    setCheckboxValue("membership_required", tpl.membership_required ?? false)
    setCheckboxValue("avec", tpl.avec ?? false)

    // payment radio: derive from whether a price is set
    const payment = tpl.price ? "paid" : "free"
    document
      .querySelectorAll<HTMLInputElement>('input[name="payment"]')
      .forEach(radio => {
        radio.checked = radio.value === payment
      })
  }

  return (
    <FieldSelect id="template" label={label} onChange={handleChange}>
      <option value="">{placeholder}</option>
      {templates.map(tpl => (
        <option key={tpl.id} value={tpl.id}>
          {tpl.name}
        </option>
      ))}
    </FieldSelect>
  )
}

export default TemplatePicker
