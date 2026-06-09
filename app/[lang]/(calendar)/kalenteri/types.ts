export type Event = {
  id: number
  user_id?: number
  name?: string
  created?: string
  starts?: string
  registration_starts?: string
  registration_ends?: string
  cancellation_starts?: string
  cancellation_ends?: string
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
