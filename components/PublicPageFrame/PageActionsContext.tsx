"use client"

import { createContext, useContext } from "react"

/**
 * Actions owned by PublicPageFrame, exposed so the page header (rendered
 * inside the MDX content) can show them as icon buttons.
 */
export type PageActions = {
  editUrl: string
}

export const PageActionsContext = createContext<PageActions | null>(null)

export const usePageActions = () => useContext(PageActionsContext)
