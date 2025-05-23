import { initLingui } from '@/initLingui'
import { getArea, getSite } from '@/lib/fetchers'
import { Trans } from '@lingui/react'
import { Metadata } from 'next'
import { Footer } from '@penx/components/Footer'
import { PageTitle } from '@penx/components/PageTitle'
import { Toc } from '@penx/components/Toc'
import { defaultEditorContent } from '@penx/constants'
import { ContentRender } from '@penx/content-render'
import linguiConfig from '@penx/libs/lingui.config'
import { AppearanceConfig } from '@penx/types'
import { cn } from '@penx/utils'
import { AreaList } from './AreaList'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Fields | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export default async function Page(props: {
  params: Promise<{ domain: string; lang: string; slug: string }>
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageTitle className="">
        <Trans id="Areas"></Trans>
      </PageTitle>
      <AreaList site={site} />
    </div>
  )
}
