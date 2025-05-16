import { initLingui } from '@/initLingui'
import { getNotes, getPhotos, getSite } from '@/lib/fetchers'
import { Metadata } from 'next'
import { PhotoListWidget } from '@penx/components/PhotoListWidget'
import linguiConfig from '@penx/libs/lingui.config'
import { AppearanceConfig } from '@penx/types'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const site = await getSite(await params)
  return {
    title: `Photos | ${site.seoTitle}`,
    description: site.seoDescription,
  }
}

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)
  const lang = (await params).lang
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang
  initLingui(locale)

  const creations = await getPhotos(site)

  return <PhotoListWidget site={site} creations={creations} />
}
