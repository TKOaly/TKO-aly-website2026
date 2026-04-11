import { readFile, writeFile } from "fs/promises"
import { join } from "path"
import { unstable_cache, revalidateTag } from "next/cache"

const getDataPath = () => join(process.cwd(), "data", "sponsors.json")

export const getSponsors = unstable_cache(
  async () => {
    try {
      const fileContents = await readFile(getDataPath(), "utf8")
      return JSON.parse(fileContents)
    } catch (error) {
      console.error("Error reading sponsors.json:", error)
      return []
    }
  },
  ["sponsors-data"],
  { tags: ["sponsors"] },
)

export async function saveSponsors(data: unknown): Promise<void> {
  try {
    await writeFile(getDataPath(), JSON.stringify(data, null, 2), "utf8")
    revalidateTag("sponsors", "")
  } catch (error) {
    console.error("Error saving sponsors.json:", error)
    throw new Error("Failed to save sponsors data")
  }
}
