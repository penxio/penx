// export const runtime = 'edge'

import { ContentRender } from '@penx/content-render'
import { getPage } from '@/lib/fetchers'

export const dynamic = 'force-static'

export default async function HomePage() {
  const page = await getPage(
    process.env.NEXT_PUBLIC_SITE_ID!,
    process.env.NEXT_PUBLIC_PRIVACY_PAGE_SLUG!,
  )

  if (!page) return null

  return (
    <div className="mx-auto mt-10 w-full sm:mt-20 lg:max-w-3xl">
      <ContentRender content={page.content} />
    </div>
  )
}
