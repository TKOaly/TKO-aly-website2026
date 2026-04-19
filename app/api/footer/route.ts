import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth"
import { saveFooter } from "@/lib/footer"

function isValidFooter(items: unknown): boolean {
  if (!Array.isArray(items)) return false

  return items.every((item: unknown) => {
    if (!item || typeof item !== "object") return false
    if (
      !("href" in item) ||
      typeof item.href !== "string" ||
      item.href.trim() === ""
    )
      return false
    if (!("labels" in item) || typeof item.labels !== "object" || !item.labels)
      return false
    if (
      !("fi" in item.labels) ||
      typeof (item.labels as Record<string, unknown>).fi !== "string" ||
      !("en" in item.labels) ||
      typeof (item.labels as Record<string, unknown>).en !== "string"
    )
      return false
    if (
      "external" in item &&
      item.external !== undefined &&
      typeof item.external !== "boolean"
    )
      return false

    return true
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { items } = await req.json()

    if (!isValidFooter(items)) {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 },
      )
    }

    await saveFooter(items)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save footer:", error)
    return NextResponse.json(
      { error: "Failed to save footer" },
      { status: 500 },
    )
  }
}
