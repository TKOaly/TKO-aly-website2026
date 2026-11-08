import type { Metadata } from "next"
import { notFound } from "next/navigation"

import PublicArticleFrame from "@/components/PublicArticleFrame/PublicArticleFrame"

import {
  type Article,
  type Lang,
  articleSlugs,
  findArticle,
  isArticleHref,
} from "@/lib/articles"
import { requireDevEnv } from "@/lib/featureFlags"
import { getNavbar } from "@/lib/navbar"
import type { NavSection } from "@/components/Navbar/Navbar"

type Props = { params: Promise<{ lang: string; slug: string[] }> }

const load = (article: Article) =>
  import(
    `../../../../content/${article.slug}/page${article.suffix}.${article.ext}`
  )

async function resolve({ params }: Props) {
  const { lang: rawLang, slug } = await params
  const lang: Lang = rawLang === "en" ? "en" : "fi"
  const article = slug.length === 1 ? findArticle(slug[0], lang) : null
  if (!article) notFound()
  return { lang, article }
}

export const generateStaticParams = () =>
  articleSlugs().map(slug => ({ slug: [slug] }))

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { article } = await resolve(props)
  return (await load(article)).metadata ?? {}
}

export default async function ArticlePage(props: Props) {
  const { lang, article } = await resolve(props)
  const { default: Content, frontmatter } = await load(article)
  if (frontmatter?.devOnly) requireDevEnv()

  const sections: NavSection[] = await getNavbar()
  const articles = sections.flatMap(section =>
    section.links
      .filter(link => !link.external && isArticleHref(link.href))
      .map(link => ({
        href: link.href,
        title: link.labels[lang] ?? link.labels.fi,
      })),
  )

  return (
    <PublicArticleFrame
      articles={articles}
      sourceFile={article.file}
      translationMissing={article.lang !== lang}
    >
      <Content />
    </PublicArticleFrame>
  )
}
