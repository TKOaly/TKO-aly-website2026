"use client"
import { useSyncExternalStore } from "react"

const breakpoints: Record<string, string> = {
  xs: "(max-width: 480px)",
  sm: "(max-width: 768px)",
  md: "(max-width: 1024px)",
  lg: "(max-width: 1280px)",
  xl: "(max-width: 1536px)",
}

/**
 * Hook to determine if the current viewport matches a given media query breakpoint.
 * True if the viewport is smaller than the specified breakpoint.
 * @param query media query break point
 * @returns boolean indicating if the media query matches
 */
export function useMatchMediaQuery(
  query: "xs" | "sm" | "md" | "lg" | "xl" = "sm",
) {
  return useSyncExternalStore(
    callback => {
      const mediaQuery = window.matchMedia(breakpoints[query])
      mediaQuery.addEventListener("change", callback)
      return () => mediaQuery.removeEventListener("change", callback)
    },
    () => window.matchMedia(breakpoints[query]).matches,
    () => false,
  )
}
