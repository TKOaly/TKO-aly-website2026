import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { unstable_cache, revalidateTag } from "next/cache"

const getDataPath = () => join(process.cwd(), "data", "footer.json")

export const getFooter = unstable_cache(
  async () => {
    try {
      const fileContents = await readFile(getDataPath(), "utf8")
      return JSON.parse(fileContents)
    } catch (error) {
      console.error("Error reading footer.json:", error)
      return []
    }
  },
  ["footer-data"],
  { tags: ["footer"] },
)

export async function saveFooter(data: unknown): Promise<void> {
  try {
    await writeFile(getDataPath(), JSON.stringify(data, null, 2), "utf8")
    revalidateTag("footer", "")
  } catch (error) {
    console.error("Error saving footer.json:", error)
    throw new Error("Failed to save footer data")
  }
}
