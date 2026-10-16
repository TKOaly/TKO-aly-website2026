type EventTranslation = {
  title: string
  description: string
  locale: string
}

type EventTypeTranslation = {
  locale: string
  event_type: string
}

export type EventType = {
  id?: number
  implicit_alcohol_meter?: number
  translations: EventTypeTranslation[]
}

type LocationTranslation = {
  locale: string
  location: string
}

export type Location = {
  id?: number
  map_link?: string
  translations: LocationTranslation[]
}

type CustomFieldTranslation = {
  locale: string
  name: string
}

export type CustomField = {
  type: "textarea" | "radio" | "checkbox" | "text"
  options?: string[]
  required?: boolean
  translations: CustomFieldTranslation[]
}

type RegistrationQuotaTranslation = {
  locale: string
  quota_name: string
}

export type RegistrationQuota = {
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
  alcohol_meter?: number
  price?: string
  responsible?: string
  show_responsible?: boolean
  weekly_event?: boolean
  weekly_event_end_time?: Date
  template?: boolean
  translations: EventTranslation[]
  location: Location
  eventType: EventType
  fields: CustomField[]
  registrationQuotas: RegistrationQuota[]
}
