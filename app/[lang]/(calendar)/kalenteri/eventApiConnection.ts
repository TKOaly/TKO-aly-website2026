"use server"

import type { Event } from "./types"

const baseUrl: string | undefined = process.env.EVENTS_API_BASE_URL

export async function getEventById(
  id: number,
  locale: string,
): Promise<Event | undefined> {
  if (!baseUrl) {
    return undefined
  }

  const params = new URLSearchParams({ locale })

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/${id}?${params}`
  const response = await fetch(targetUrl)

  if (!response.ok) {
    return undefined
  }

  return response.json()
}

export async function getEventList(
  locale: string,
  fromDate?: Date,
): Promise<Event[] | undefined> {
  if (!baseUrl) {
    return undefined
  }

  const params = new URLSearchParams({ locale })

  if (fromDate) {
    params.set("fromDate", fromDate.toISOString())
  }

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/eventList?${params}`

  const response = await fetch(targetUrl)

  if (!response.ok) {
    return undefined
  }

  return response.json()
}
