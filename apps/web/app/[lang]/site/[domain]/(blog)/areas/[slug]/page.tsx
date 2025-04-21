import { ContentRender } from '@penx/content-render'
import { Footer } from '@penx/components/theme-ui/Footer'
import { PageTitle } from '@penx/components/theme-ui/PageTitle'
import { Toc } from '@penx/components/theme-ui/Toc'
import { initLingui } from '@/initLingui'
import { editorDefaultValue } from '@penx/constants'
import { getArea, getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@penx/types'
import { cn } from '@penx/utils'
import linguiConfig from '@penx/libs/lingui.config'
import { Trans } from '@lingui/react/macro'
import { AreaType } from '@prisma/client'
import { Metadata } from 'next'
import { Header } from './book/Header'
import { Sidebar } from './book/Sidebar'
import { AreaInfo } from './column/AreaInfo'
import { AreaPostList } from './column/AreaPostList'

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
    title: `Areas | ${site.seoTitle}`,
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

  const field = await getArea(site.id, params.slug)

  if (field?.type === AreaType.COLUMN) {
    return <AreaPostList area={field as any} />
  }

  return (
    <div className="flex h-full gap-x-16 pt-4">
      <div className={cn('flex flex-1 flex-col')}>
        <div className="mb-auto flex-1">
          <header className="space-y-4 pb-4">
            <div className="mb-4">
              <PageTitle className="mb-2 mt-4">
                <Trans>About</Trans>
              </PageTitle>
            </div>
          </header>
          <div className="pt-2 md:pt-4">
            <div className="">
              <ContentRender
                content={
                  field?.about ? JSON.parse(field.about) : editorDefaultValue
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Toc
        content={field?.about ? JSON.parse(field.about) : editorDefaultValue}
        className="sticky top-20 hidden w-56 overflow-y-auto py-10 pl-6 xl:block"
        style={{
          height: 'calc(100vh - 4rem)',
        }}
      ></Toc>
    </div>
  )
}
