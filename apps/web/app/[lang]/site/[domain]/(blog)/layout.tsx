import { CreationListProvider } from '@penx/components/CreationListContext'
import { SiteProvider } from '@penx/contexts/SiteContext'
import { initLingui } from '@/initLingui'
import { ROOT_DOMAIN } from '@penx/constants'
import {
  getCreations,
  getFriends,
  getPodcasts,
  getSite,
  getTags,
} from '@/lib/fetchers'
import { loadTheme } from '@/lib/loadTheme'
import { redirectTo404 } from '@/lib/redirectTo404'
import { AppearanceConfig } from '@penx/types'
import { cn } from '@penx/utils'
import linguiConfig from '@penx/libs/lingui.config'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)
  if (!site) return redirectTo404()

  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const lang = (await params).lang
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const [creations, tags] = await Promise.all([
    getCreations(site),
    getTags(site.id),
  ])

  const { SiteLayout } = loadTheme('garden')
  const brand = appearance?.color || 'oklch(0.656 0.241 354.308)'
  const baseFont = appearance?.baseFont

  let font = 'font-sans'
  if (baseFont === 'serif') font = 'font-serif'
  if (baseFont === 'sans') font = 'font-sans'
  if (baseFont === 'mono') font = 'font-mono'

  const headerList = await headers()

  return (
    <div
      className={cn(font)}
      style={
        {
          '--brand': brand,
          '--primary': brand,
        } as any
      }
    >
      <SiteLayout site={site} tags={tags}>
        <SiteProvider site={site as any}>
          <CreationListProvider
            creations={creations as any}
            backLinkCreations={[]}
          >
            {children}
          </CreationListProvider>
        </SiteProvider>
      </SiteLayout>
    </div>
  )
}
