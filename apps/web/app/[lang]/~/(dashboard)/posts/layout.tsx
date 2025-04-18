import { ReactNode } from 'react'
import { SiteLink } from '@/components/SiteLink'
import { initLingui } from '@/initLingui'
import linguiConfig from '@/lingui.config'
import { Trans } from '@lingui/react/macro'
import { PostsNav } from './components/PostsNav'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function Layout({
  params,
  children,
}: {
  children: ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang
  initLingui(locale)

  return (
    <div className="flex flex-col gap-8 p-3 md:p-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">
            <Trans>Posts</Trans>
          </div>
        </div>
        <div>
          <SiteLink></SiteLink>
        </div>
      </div>
      <PostsNav />
      {children}
    </div>
  )
}
