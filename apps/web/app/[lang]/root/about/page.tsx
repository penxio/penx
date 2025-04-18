// export const runtime = 'edge'

import { ContentRender } from '@/components/theme-ui/ContentRender/ContentRender'
import { getPage } from '@/lib/fetchers'

export const dynamic = 'force-static'

export default async function HomePage() {
  const page = await getPage(
    process.env.NEXT_PUBLIC_SITE_ID!,
    process.env.NEXT_PUBLIC_ABOUT_PAGE_SLUG!,
  )

  if (!page) return null

  const content = page.content

  return (
    <div className="mx-auto mt-10 w-full sm:mt-20 lg:max-w-2xl">
      <ContentRender content={content} />
    </div>
  )
}
