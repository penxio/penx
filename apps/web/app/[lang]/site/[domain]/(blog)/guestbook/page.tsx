import { CreationProvider } from '@penx/contexts/CreationContext'
import { ContentRender } from '@penx/content-render'
import { editorDefaultValue } from '@penx/constants'
import { getPage, getSite } from '@/lib/fetchers'
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
    title: `Guestbook | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const page = await getPage(site.id, 'guestbook')

  return (
    <div className="mx-auto max-w-2xl">
      <CreationProvider creation={page as any}>
        <ContentRender content={page?.content || editorDefaultValue} />
      </CreationProvider>
    </div>
  )
}
