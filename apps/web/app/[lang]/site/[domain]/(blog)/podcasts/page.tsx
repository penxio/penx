import { NoteListWidget } from '@/components/theme-ui/NoteListWidget'
import { PodcastListWidget } from '@/components/theme-ui/PodcastListWidget'
import { initLingui } from '@/initLingui'
import { getPodcasts, getSite } from '@/lib/fetchers'
import { AppearanceConfig } from '@penx/types'
import linguiConfig from '@/lingui.config'
import { Metadata } from 'next'

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
