import { initLingui } from '@/initLingui'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { getCreations, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@/lib/theme.types'
import linguiConfig from '@/lingui.config'
import { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Writings | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)
  const lang = (await params).lang
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang
  initLingui(locale)

  const creations = await getCreations(site)
  const pageNumber = 1
  const initialDisplayCreations = creations.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(creations.length / POSTS_PER_PAGE),
  }

  const { BlogPage } = loadTheme('garden')

  if (!BlogPage) {
    return <div>Theme not found</div>
  }

  return (
    <BlogPage
      site={site}
      creations={creations}
      authors={[]}
      initialDisplayCreations={initialDisplayCreations}
      pagination={pagination}
    />
  )
}
