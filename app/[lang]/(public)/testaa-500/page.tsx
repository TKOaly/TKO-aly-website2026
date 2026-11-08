import { notFound } from "next/navigation"

import { isDevEnv } from "@/lib/featureFlags"

// Never prerender: this page throws on purpose.
export const dynamic = "force-dynamic"

/** Dev-only: visit /fi/testaa-500 to see the 500 page. Responds 404 elsewhere. */
export default function Test500() {
  if (!isDevEnv()) notFound()
  throw new Error("Test error: triggered from /testaa-500")
}
