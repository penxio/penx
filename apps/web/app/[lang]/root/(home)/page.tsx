import { Suspense } from 'react'
import { initLingui } from '@/initLingui'
import { getHomeSites, getSiteCount } from '@/lib/fetchers'
import { Trans } from '@lingui/react'
import { Metadata } from 'next'
import { FeatureList } from './FeatureList'
import { Screenshots } from './Screenshots'
import { SiteCount } from './SiteCount'
import { SiteList } from './SiteList'

const appUrl = process.env.NEXT_PUBLIC_URL

const frame = {
  version: 'next',
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: 'Create my digital garden',
    action: {
      type: 'launch_frame',
      name: 'PenX',
      url: appUrl,
      splashImageUrl: `${appUrl}/images/logo-192.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24 * 365

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PenX - A structured note-taking App',
    description:
      'An elegant App designed to help you capture, organize, and store your thoughts, tasks, ideas, and information.',
    openGraph: {
      title: 'PenX',
      description: 'A structured note-taking App',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default async function HomePage(props: { params: any }) {
  const lang = (await props.params).lang
  initLingui(lang === 'pseudo' ? 'en' : lang)
  const [count, sites] = await Promise.all([getSiteCount(), getHomeSites()])

  return (
    <div className="flex flex-col gap-y-32">
      {/* <div className="mt-8 flex justify-center">
        <SiteCount
          count={count}
          sites={[
            ...sites.slice(1, 4),
            ...sites.slice(5, 6),
            ...sites.slice(12, 13),
          ]}
        />
      </div> */}

      <FeatureList />
    </div>
  )
}
