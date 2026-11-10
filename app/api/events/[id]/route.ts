import { NextResponse, NextRequest } from "next/server"
import { EventRecord } from "../route"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/${id}`
    const secret = process.env.EVENT_SERVICE_TOKEN || ""
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
        "X-Token": secret,
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
