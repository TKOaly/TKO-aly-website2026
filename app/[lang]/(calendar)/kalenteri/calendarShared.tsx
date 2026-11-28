import type { ProcessedEvent } from "./types"

/** Locale for dates in the given site language. */
export function dateLocale(lang: string | string[]) {
  return String(lang) === "en" ? "en-GB" : "fi-FI"
}

/** Short upper-case month, e.g. "TAM" or "JAN". */
export function shortMonth(date: Date, locale: string) {
  return date
    .toLocaleDateString(locale, { month: "short" })
    .slice(0, 3)
    .toUpperCase()
}

export function weekdayHeaders(locale: string) {
  return Array.from({ length: 7 }, (_, i) =>
    new Date(2026, 0, 5 + i)
      .toLocaleDateString(locale, { weekday: "short" })
      .toUpperCase(),
  )
}

export const STATUS_COLORS = {
  open: "var(--event-open)",
  notOpen: "var(--event-not-open)",
  noRegistration: "var(--event-no-registration)",
  closed: "var(--event-closed)",
  passed: "var(--event-passed)",
} as const

export const LEGEND = [
  { color: STATUS_COLORS.open, key: "registrationOpen" },
  { color: STATUS_COLORS.notOpen, key: "registrationNotOpen", hollow: true },
  { color: STATUS_COLORS.noRegistration, key: "canNotRegistration" },
  { color: STATUS_COLORS.closed, key: "registrationClosed" },
  { color: STATUS_COLORS.passed, key: "passedEvent" },
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
