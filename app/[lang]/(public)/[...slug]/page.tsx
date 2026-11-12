import type { Metadata } from "next"
import { notFound } from "next/navigation"

import PublicPageFrame from "@/components/PublicPageFrame/PublicPageFrame"

import {
  type ContentPage,
  type Lang,
  pageSlugs,
  findPage,
  isPageHref,
} from "@/lib/pages"
import { requireDevEnv } from "@/lib/featureFlags"
import { getNavbar } from "@/lib/navbar"
import type { NavSection } from "@/components/Navbar/Navbar"

type Props = { params: Promise<{ lang: string; slug: string[] }> }

const load = (page: ContentPage) =>
  import(`../../../../content/${page.slug}/page${page.suffix}.${page.ext}`)

async function resolve({ params }: Props) {
  const { lang: rawLang, slug } = await params
  const lang: Lang = rawLang === "en" ? "en" : "fi"
  const page = slug.length === 1 ? findPage(slug[0], lang) : null
  if (!page) notFound()
  return { lang, page }
}

export const generateStaticParams = () =>
  pageSlugs().map(slug => ({ slug: [slug] }))

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { page } = await resolve(props)
  return (await load(page)).metadata ?? {}
}

export default async function PublicPage(props: Props) {
  const { lang, page } = await resolve(props)
  const { default: Content, frontmatter } = await load(page)
  if (frontmatter?.devOnly) requireDevEnv()

  const sections: NavSection[] = await getNavbar()
  const pages = sections.flatMap(section =>
    section.links
      .filter(link => !link.external && isPageHref(link.href))
      .map(link => ({
        href: link.href,
        title: link.labels[lang] ?? link.labels.fi,
      })),
  )

  return (
    <PublicPageFrame
      pages={pages}
      sourceFile={page.file}
      translationMissing={page.lang !== lang}
    >
      <Content />
    </PublicPageFrame>
  )
}
