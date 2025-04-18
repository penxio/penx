import {
  getCreations,
  getFirstSite,
  getSite,
  getTags,
  getTagWithCreation,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
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
    title: `Tags | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

// TODO:
export const generateStaticParams = async () => {
  return []
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string; domain: string }>
}) {
  const p = await params
  const tagName = decodeURI(p.tag)

  const site = await getSite(p)
  const [allCreations, tagWithCreations, tags] = await Promise.all([
    getCreations(site),
    getTagWithCreation(site.id, tagName),
    getTags(site.id),
  ])

  const creations =
    tagWithCreations?.creationTags.map((item) => item.creation) || []

  const { TagDetailPage } = loadTheme('garden')

  return (
    <TagDetailPage
      site={site}
      allCreations={allCreations}
      creations={creations}
      tags={tags}
    />
  )
}
