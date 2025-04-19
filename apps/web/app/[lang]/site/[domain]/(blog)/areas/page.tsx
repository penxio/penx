import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Footer } from '@/components/theme-ui/Footer'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Toc } from '@/components/theme-ui/Toc'
import { initLingui } from '@/initLingui'
import { editorDefaultValue } from '@penx/constants'
import { getArea, getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@penx/types'
import { cn } from '@penx/utils'
import linguiConfig from '@/lingui.config'
import { Trans } from '@lingui/react/macro'
import { Metadata } from 'next'
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
        <Trans>Areas</Trans>
      </PageTitle>
      <AreaList site={site} />
    </div>
  )
}
