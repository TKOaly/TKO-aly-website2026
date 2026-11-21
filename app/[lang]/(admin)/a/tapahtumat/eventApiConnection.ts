"use server"

import { EditEvent, editEventsSchema } from "./validators"

const baseUrl: string | undefined = process.env.EVENTS_API_BASE_URL
const secret: string = process.env.EVENT_SERVICE_TOKEN || ""

export async function getEditEvents(): Promise<EditEvent[]> {
  try {
    const res = await fetch(`${baseUrl}/api/events`, {
      headers: { "X-Token": secret },
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const parsed = editEventsSchema.safeParse(await res.json())

    if (!parsed.success) {
      return []
    }

    return parsed.data
  } catch {
    return []
  }
}
