import { ReactNode } from 'react'
import { initLingui } from '@/initLingui'
import { Trans } from '@lingui/react'
import { SiteLink } from '@penx/components/SiteLink'
import linguiConfig from '@penx/libs/lingui.config'

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
            <Trans id="Archived"></Trans>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
