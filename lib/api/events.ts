export type EventRecord = Record<string, unknown>

export async function fetchAllEvents(): Promise<EventRecord[]> {
  const response = await fetch(`/api/events`, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch events: ${response.status} ${response.statusText}`,
    )
  }

  const data = (await response.json()) as EventRecord[]
  return data
}
