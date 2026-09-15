type EventTranslation = {
  title: string
  description: string
  locale: string
}

type EventTypeTranslation = {
  locale: string
  event_type: string
}

type EventType = {
  id?: number
  implicit_alcohol_meter?: number
  translations: EventTypeTranslation[]
}

type LocationTranslation = {
  locale: string
  location: string
}

type Location = {
  id?: number
  map_link?: string
  translations: LocationTranslation[]
}

type CustomFieldTranslation = {
  locale: string
  name: string
}

type CustomField = {
  type: "textarea" | "radio" | "checkbox" | "text"
  options?: string[]
  required?: boolean
  translations: CustomFieldTranslation[]
}

type RegistrationQuotaTranslation = {
  locale: string
  quota_name: string
}

type RegistrationQuota = {
  max_participants: number
  registration_starts: Date
  registration_ends: Date
  translations: RegistrationQuotaTranslation
  membership_required?: boolean
  outsiders_allowed?: boolean
  avec_can_attend?: boolean
  cancellation_starts?: Date
  cancellation_ends?: Date
  fields?: CustomField[]
}

export type EventFormValues = {
  user_id: number
  starts: Date
  translations: EventTranslation[]
  eventType: EventType
  location: Location
  publishing_time?: Date
  alcohol_meter?: number
  price?: string
  show_responsible?: boolean
  responsible?: string
  weekly_event?: boolean
  weekly_event_end_time?: Date
  fields?: CustomField[]
  registrationQuotas?: RegistrationQuota[]
  template?: boolean
}
