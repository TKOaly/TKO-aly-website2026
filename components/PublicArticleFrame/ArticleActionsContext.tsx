"use client"

import { createContext, useContext } from "react"

/**
 * Share / edit actions owned by PublicArticleFrame, exposed so the article
 * header (rendered inside the MDX content) can show them as icon buttons.
 */
export type ArticleActions = {
  share: () => void
  shared: boolean
  editUrl: string
}

export const ArticleActionsContext = createContext<ArticleActions | null>(null)

export const useArticleActions = () => useContext(ArticleActionsContext)
