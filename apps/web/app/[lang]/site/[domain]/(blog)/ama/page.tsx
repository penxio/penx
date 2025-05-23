import { getPage, getSite } from '@/lib/fetchers'
import { Metadata } from 'next'
import { defaultEditorContent } from '@penx/constants'
import { ContentRender } from '@penx/content-render'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `AMA | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const page = await getPage(site.id, 'ama')

  return (
    <div className="mx-auto max-w-2xl">
      <ContentRender content={page?.content || defaultEditorContent} />
    </div>
  )
}
