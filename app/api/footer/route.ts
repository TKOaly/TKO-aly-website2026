import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { config as authOptions } from "@/auth"
import { saveFooter } from "@/lib/footer"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { items } = await req.json()
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
