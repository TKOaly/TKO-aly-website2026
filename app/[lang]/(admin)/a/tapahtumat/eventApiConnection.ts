"use server"

import { EditEvent, editEventsSchema, Event, eventsSchema } from "./validators"

const baseUrl: string | undefined = process.env.EVENTS_API_BASE_URL
const secret: string = process.env.EVENT_SERVICE_TOKEN || ""

export async function getEditEvents(): Promise<EditEvent[]> {
  try {
    const result = await fetch(`${baseUrl}/api/events`, {
      cache: "no-store",
    })

    if (!result.ok) {
      return []
    }

    const parsed = editEventsSchema.safeParse(await result.json())

    if (!parsed.success) {
      return []
    }

    return parsed.data
  } catch {
    return []
  }
}

export async function getTemplates(): Promise<Event[]> {
  try {
    const result = await fetch(`${baseUrl}/api/events`, {
      cache: "no-store",
    })

    if (!result.ok) {
      return []
    }

    const parsed = eventsSchema.safeParse(await result.json())

    if (!parsed.success) {
      return []
    }

    return parsed.data
  } catch {
    return []
  }
}

export async function postEvent(event: Event) {
  const response = await fetch(`${baseUrl}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": secret,
    },
    body: JSON.stringify(event),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Event creation failed with status ${response.status}`)
  }
}

export async function putEvent(eventId: number, event: Event) {
  const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Token": secret,
    },
    body: JSON.stringify(event),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Event update failed with status ${response.status}`)
  }
}
