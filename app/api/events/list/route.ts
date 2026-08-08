import { NextResponse } from "next/server"
import { EventRecord } from "../route"

export async function GET(): Promise<NextResponse> {
  try {
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/event_list`

    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const data = (await response.json()) as EventRecord[]

    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reach events API"

    return NextResponse.json({ error: message }, { status: 502 })
  }
}
