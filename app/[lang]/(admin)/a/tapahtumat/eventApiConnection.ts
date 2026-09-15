"use server"

import type { Location, EventType } from "./types";

const baseUrl: string | undefined = process.env.EVENTS_API_BASE_URL

async function getLocations(locale: string):  Promise<Location[] | undefined> {
  if (!baseUrl) {
    return undefined
  }

  const params = new URLSearchParams({ locale })

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/locations?${params}`
  const response = await fetch(targetUrl)

  if (!response.ok) {
    return undefined
  }

  return response.json()
}

async function getEventTypes(locale: string):  Promise<Location[] | undefined> {
  if (!baseUrl) {
    return undefined
  }

  const params = new URLSearchParams({ locale })

  const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/types?${params}`
  const response = await fetch(targetUrl)

  if (!response.ok) {
    return undefined
  }

  return response.json()
}