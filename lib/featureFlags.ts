import { notFound } from "next/navigation"

/**
 * Unfinished (mocked) pages are shown only when APP_ENV=dev. Anything else,
 * including an unset variable, hides them.
 */
const unfinishedRoutes = ["/jaseneksi", "/u/muokkaa", "/u/jasenmaksu"]

export const isDevEnv = () => process.env.APP_ENV === "dev"

export const hiddenRoutes = () => (isDevEnv() ? [] : unfinishedRoutes)

/** Call at the top of an unfinished page: responds 404 outside dev. */
export function requireDevEnv() {
  if (!isDevEnv()) notFound()
}
