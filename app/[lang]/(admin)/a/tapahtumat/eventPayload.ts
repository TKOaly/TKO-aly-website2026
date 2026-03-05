export type PostEventPayload = {
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
  if (typeof value !== "string" || value.trim() === "") return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const parseOptionalDate = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string" || value.trim() === "") return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const parseCheckbox = (value: FormDataEntryValue | null) => value === "on"

const parseOptionalText = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed === "" ? undefined : trimmed
}

export const buildEventPayload = (formData: FormData): PostEventPayload => {
  const date = formData.get("date")
  const time = formData.get("time")
  const startsValue =
    typeof date === "string" &&
    typeof time === "string" &&
    date !== "" &&
    time !== ""
      ? `${date}T${time}`
      : null

  return {
    name: String(formData.get("name") ?? "").trim(),
    starts: parseOptionalDate(startsValue),
    registration_starts: parseOptionalDate(formData.get("registration_starts")),
    registration_ends: parseOptionalDate(formData.get("registration_ends")),
    cancellation_starts: parseOptionalDate(formData.get("cancellation_starts")),
    cancellation_ends: parseOptionalDate(formData.get("cancellation_ends")),
    location: parseOptionalText(formData.get("venue")),
    category: parseOptionalText(formData.get("event_type")),
    description: parseOptionalText(formData.get("description")),
    alcohol_meter: parseOptionalNumber(formData.get("alcohol_scale")),
    price:
      formData.get("payment") === "free"
        ? undefined
        : parseOptionalText(formData.get("price")),
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
}
