import { getFriends, getPage, getSite } from '@/lib/fetchers'
import { Metadata } from 'next'
import { defaultEditorContent } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import { FriendsProvider } from '@penx/contexts/FriendsContext'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Friends | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const site = await getSite(await params)
  const friends = await getFriends(site)
  const page = await getPage(site.id, 'friends')

  return (
    <div className="mx-auto w-full max-w-2xl">
      <FriendsProvider friends={friends}>
        <ContentRender content={page?.content || defaultEditorContent} />
      </FriendsProvider>
    </div>
  )
}
