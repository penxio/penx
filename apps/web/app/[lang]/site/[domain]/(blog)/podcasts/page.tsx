import { initLingui } from '@/initLingui'
import { getPodcasts, getSite } from '@/lib/fetchers'
import { Metadata } from 'next'
import { NoteListWidget } from '@penx/components/NoteListWidget'
import { PodcastListWidget } from '@penx/components/PodcastListWidget'
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
    title: `Podcasts | ${site.seoTitle}`,
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

  const creations = await getPodcasts(site)

  return <PodcastListWidget site={site} creations={creations} />
}
