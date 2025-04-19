import { AreaContext } from '@/components/AreaContext'
import { SiteProvider } from '@/components/SiteContext'
import { Footer } from '@/components/theme-ui/Footer'
import { initLingui } from '@/initLingui'
import { getArea, getSite, getTags } from '@/lib/fetchers'
import { redirectTo404 } from '@/lib/redirectTo404'
import { AppearanceConfig } from '@penx/types'
import { cn } from '@penx/utils'
import linguiConfig from '@/lingui.config'
import { Metadata } from 'next'
import { Header as BookHeader } from './book/Header'
import { Sidebar } from './book/Sidebar'
import { AreaInfo } from './column/AreaInfo'
import { Header as ColumnHeader } from './column/Header'
import { PanelSidebar } from './PanelSidebar/PanelSidebar'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string; slug: string }>
}) {
  const params = await props.params
  const site = await getSite(params)
  if (!site) return redirectTo404()

  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = params.lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const brand = appearance?.color || 'oklch(0.656 0.241 354.308)'
  const baseFont = appearance?.baseFont

  let font = 'font-sans'
  if (baseFont === 'serif') font = 'font-serif'
  if (baseFont === 'sans') font = 'font-sans'
  if (baseFont === 'mono') font = 'font-mono'

  const field = await getArea(site.id, params.slug)

  return (
    <div
      className={cn('flex min-h-screen flex-col', font)}
      style={
        {
          '--brand': brand,
          '--primary': brand,
        } as any
      }
    >
      <SiteProvider site={site as any}>
        <AreaContext area={field as any}>
          <div>
            {/* <BookHeader site={site} field={field as any} /> */}
            <main className="relative mx-auto flex w-full max-w-7xl flex-1 gap-x-16 px-4 xl:px-0">
              {/* <Sidebar
                field={field as any}
                site={site}
                className="hidden md:block"
              /> */}

              <PanelSidebar
                area={field as any}
                site={site}
                className="fixed left-2 hidden h-[80vh] md:flex"
              />
              <div className="flex-1">{props.children}</div>
            </main>
          </div>
        </AreaContext>
      </SiteProvider>
    </div>
  )
}
