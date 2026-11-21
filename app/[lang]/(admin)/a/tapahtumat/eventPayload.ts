import { Event, EventFormValues, eventSchema } from "./validators"

export const buildEventPayload = (formData: EventFormValues): Event => {
  const {
    starts_date,
    starts_time,
    publish_date,
    publish_time,
    weeklyEventEnd_date,
    weeklyEventEnd_time,
    ...rest
  } = formData

  const starts = new Date(`${starts_date}T${starts_time}`).toISOString()

  const publishing_time =
    publish_date && publish_date
      ? new Date(`${publish_date}T${publish_time}`).toISOString()
      : new Date().toISOString()

  const weekly_event_end_time =
    weeklyEventEnd_date && weeklyEventEnd_time
      ? new Date(`${weeklyEventEnd_date}T${weeklyEventEnd_time}`).toISOString()
      : new Date().toISOString()

  const payload = eventSchema.parse({
    starts,
    weekly_event_end_time,
    publishing_time,
    deleted: false,
    user_id: 0, // TODO user_id
    ...rest,
  })

  return payload
}
