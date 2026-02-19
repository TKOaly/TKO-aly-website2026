import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  try {
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events`

    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    const body = await response.text()

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reach events API"

    return NextResponse.json({ error: message }, { status: 502 })
  }
}
