import { initLingui } from '@/initLingui'
import { getCreations, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { Metadata } from 'next'
import { POSTS_PER_PAGE } from '@penx/constants'
import linguiConfig from '@penx/libs/lingui.config'
import { AppearanceConfig } from '@penx/types'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Docs | ${site.seoTitle}`,
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
