export type EventFormValues = {
  id?: number
  name: string
  starts: string | null
  registration_starts: string | null
  registration_ends: string | null
  cancellation_starts: string | null
  cancellation_ends: string | null
  location: string | null
  category: string | null
  description: string | null
  alcohol_meter: number | null
  price: string | null
  map: string | null
  max_participants: number | null
  membership_required: boolean | null
  outsiders_allowed: boolean | null
  responsible: string | null
  show_responsible: boolean | null
  avec: boolean | null
}
