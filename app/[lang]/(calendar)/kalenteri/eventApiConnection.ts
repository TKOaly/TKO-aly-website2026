"use server"

import type { Event } from "./types"

const baseUrl: string | undefined = process.env.EVENTS_API_BASE_URL
const secret: string = process.env.EVENT_SERVICE_TOKEN || ""

export async function getEventById(id: number): Promise<Event | undefined> {
  if (!baseUrl) {
    return undefined
  }

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/${id}`
  const response = await fetch(targetUrl, { next: { revalidate: 10 } })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch event: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

export async function getEventList(
  fromDate?: Date,
): Promise<Event[] | undefined> {
  if (!baseUrl) {
    return undefined
  }

  const params = new URLSearchParams()

  if (fromDate) {
    params.set("fromDate", fromDate.toISOString())
  }

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/list?${params}`

  const response = await fetch(targetUrl, {
    headers: {
      Accept: "application/json",
      "X-Token": secret,
    },
    next: { revalidate: 10 },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch events: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}
