import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { unstable_cache, revalidateTag } from "next/cache"

const getDataPath = () => join(process.cwd(), "data", "navbar.json")

export const getNavbar = unstable_cache(
  async () => {
    try {
      const fileContents = await readFile(getDataPath(), "utf8")
      return JSON.parse(fileContents)
    } catch (error) {
      console.error("Error reading navbar.json:", error)
      return []
    }
  },
  ["navbar-data"], // cache key
  { tags: ["navbar"] }, // cache tag for revalidation
)

export async function saveNavbar(data: unknown): Promise<void> {
  try {
    await writeFile(getDataPath(), JSON.stringify(data, null, 2), "utf8")
    revalidateTag("navbar", "")
  } catch (error) {
    console.error("Error saving navbar.json:", error)
    throw new Error("Failed to save navbar data")
  }
}
