import { usePathname, useRouter } from "next/navigation"

export const useToggleLanguage = (lang: string | string[]) => {
  const pathname = usePathname()
  const router = useRouter()

  return () => {
    const newLanguage = lang === "fi" ? "en" : "fi"
    const newPath = pathname.replace(`/${lang}`, `/${newLanguage}`)
    document.cookie = `tekis-language=${newLanguage}; path=/`
    router.push(newPath)
  }
}
