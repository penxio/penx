import { FriendsProvider } from '@/components/FriendsContext'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { editorDefaultValue } from '@/lib/constants'
import { getFriends, getPage, getSite } from '@/lib/fetchers'
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
        <ContentRender content={page?.content || editorDefaultValue} />
      </FriendsProvider>
    </div>
  )
}
