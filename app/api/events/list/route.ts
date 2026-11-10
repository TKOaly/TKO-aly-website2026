import { NextResponse } from "next/server"
import { EventRecord } from "../route"

export async function GET(): Promise<NextResponse> {
  try {
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const secret = process.env.EVENT_SERVICE_TOKEN || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/list`

    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
        "X-Token": secret,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.log("/api/events/list", response.status, response.statusText)
      throw new Error("")
    }

    const data = (await response.json()) as EventRecord[]

    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reach events API"

    return NextResponse.json({ error: message }, { status: 502 })
  }
}
