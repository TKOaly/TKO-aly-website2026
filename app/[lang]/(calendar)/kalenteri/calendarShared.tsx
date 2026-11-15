import type { ProcessedEvent } from "./types"

export const MONTHS = [
  "TAM",
  "HEL",
  "MAA",
  "HUH",
  "TOU",
  "KES",
  "HEI",
  "ELO",
  "SYY",
  "LOK",
  "MAR",
  "JOU",
]
export const WEEKDAYS = ["su", "ma", "ti", "ke", "to", "pe", "la"]

// Colors come from processEvents in page.tsx.
export const LEGEND = [
  { color: "#00ff00", key: "registrationOpen" },
  { color: "#ffff00", key: "registrationNotOpen", hollow: true },
  { color: "#0066ff", key: "canNotRegistration" },
  { color: "#ff0000", key: "registrationClosed" },
  { color: "#6e6e6e", key: "passedEvent" },
] as const

export type LegendItem = (typeof LEGEND)[number]

export function statusOf(color: string): LegendItem {
  return LEGEND.find(item => item.color === color) ?? LEGEND[4]
}

export function formatTime(date: Date) {
  const h = date.getHours().toString().padStart(2, "0")
  const m = date.getMinutes().toString().padStart(2, "0")
  return `${h}.${m}`
}

/** Events from today onwards, soonest first. */
export function upcomingEvents(events: ProcessedEvent[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return events
    .filter(event => new Date(event.starts) >= today)
    .sort((a, b) => new Date(a.starts).getTime() - new Date(b.starts).getTime())
}

export function Swatch({
  color,
  hollow = false,
  size = 12,
}: {
  color: string
  hollow?: boolean
  size?: number
}) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        flexShrink: 0,
        boxSizing: "border-box",
        width: size,
        height: size,
        ...(hollow
          ? { border: `2px solid ${color}` }
          : { backgroundColor: color }),
      }}
    />
  )
}
