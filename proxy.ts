import acceptLanguage from "accept-language"
import { NextRequest, NextResponse } from "next/server"
import { cookieName, fallbackLang, languages } from "./app/i18n/settings"

acceptLanguage.languages([...languages])

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}

export function proxy(req: NextRequest) {
  let lang: string | undefined

  // Check cookie first
  if (req.cookies.has(cookieName)) {
    lang = acceptLanguage.get(req.cookies.get(cookieName)?.value) ?? undefined
  }

  // Fall back to Accept-Language header
  if (!lang) {
    lang = acceptLanguage.get(req.headers.get("Accept-Language")) ?? undefined
  }

  // Fall back to default language
  if (!lang) lang = fallbackLang

  // Redirect if language prefix is not in the path
  const pathnameHasLang = languages.some(
    loc =>
      req.nextUrl.pathname.startsWith(`/${loc}/`) ||
      req.nextUrl.pathname === `/${loc}`,
  )

  if (!pathnameHasLang) {
    return NextResponse.redirect(
      new URL(`/${lang}${req.nextUrl.pathname}`, req.url),
    )
  }

  // Set cookie to remember chosen language
  const response = NextResponse.next()

  const detectedLang = languages.find(
    loc =>
      req.nextUrl.pathname.startsWith(`/${loc}/`) ||
      req.nextUrl.pathname === `/${loc}`,
  )

  if (detectedLang) {
    response.cookies.set(cookieName, detectedLang)
  }

  return response
}
