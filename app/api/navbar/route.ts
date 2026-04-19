import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth"
import { saveNavbar } from "@/lib/navbar"

function isValidNavbar(items: unknown): boolean {
  if (!Array.isArray(items)) return false
  return items.every(section => {
    if (!section || typeof section !== "object") return false
    if (!("labels" in section) || typeof section.labels !== "object")
      return false
    if (
      !("descriptions" in section) ||
      typeof section.descriptions !== "object"
    )
      return false
    if (!("links" in section) || !Array.isArray(section.links)) return false
    return section.links.every((link: unknown) => {
      if (!link || typeof link !== "object") return false
      if (!("href" in link) || typeof link.href !== "string") return false
      if (!("labels" in link) || typeof link.labels !== "object") return false
      return true
    })
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { items } = await req.json()

    if (!isValidNavbar(items)) {
      return NextResponse.json(
        { error: "Invalid payload format" },
        { status: 400 },
      )
    }

    await saveNavbar(items)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save navbar:", error)
    return NextResponse.json(
      { error: "Failed to save navbar" },
      { status: 500 },
    )
  }
}
