import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth"
import { saveSponsors } from "@/lib/sponsors"

function isValidSponsors(items: unknown): boolean {
  if (!Array.isArray(items)) return false
  if (items.length > 48) return false

  return items.every((item: unknown) => {
    if (!item || typeof item !== "object") return false
    if (
      !("href" in item) ||
      typeof item.href !== "string" ||
      !("src" in item) ||
      typeof item.src !== "string" ||
      !("alt" in item) ||
      typeof item.alt !== "string"
    )
      return false

    if (item.href.trim() === "" || item.src.trim() === "") return false

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

    if (!isValidSponsors(items)) {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 },
      )
    }

    await saveSponsors(items)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save sponsors:", error)
    return NextResponse.json(
      { error: "Failed to save sponsors" },
      { status: 500 },
    )
  }
}
