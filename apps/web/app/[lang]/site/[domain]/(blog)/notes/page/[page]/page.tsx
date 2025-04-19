import { initLingui } from '@/initLingui'
import { POSTS_PER_PAGE } from '@penx/constants'
import { getCreations, getFirstSite, getSite } from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { AppearanceConfig } from '@penx/types'
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
    title: `Writings | ${site.name}`,
    description: site.description,
  }
}

export const generateStaticParams = async () => {
  return []
}

export default async function Page(props: {
  params: Promise<{ page: string; domain: string; lang: string }>
}) {
  const params = await props.params
  const site = await getSite(params)
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const creations = await getCreations(site)

  const pageNumber = parseInt(params.page as string)
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
