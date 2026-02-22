"use client"
import { useEffect, useMemo, useState } from "react"

/**
 * Hook to determine if the current viewport matches a given media query breakpoint.
 * True if the viewport is smaller than the specified breakpoint.
 * @param query media query break point
 * @returns boolean indicating if the media query matches
 */
export function useMatchMediaQuery(
  query: "xs" | "sm" | "md" | "lg" | "xl" = "sm",
) {
  const breakpoints: Record<string, string> = useMemo(
    () => ({
      xs: "(max-width: 480px)",
      sm: "(max-width: 768px)",
      md: "(max-width: 1024px)",
      lg: "(max-width: 1280px)",
      xl: "(max-width: 1536px)",
    }),
    [],
  )
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(breakpoints[query])
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [breakpoints, query])

  return isMobile
}
