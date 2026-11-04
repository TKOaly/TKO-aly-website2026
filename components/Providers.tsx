"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

const queryClient = new QueryClient()

export default function Providers({
  children,
  session,
}: {
  children: ReactNode
  session: Session | null
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </QueryClientProvider>
  )
}
