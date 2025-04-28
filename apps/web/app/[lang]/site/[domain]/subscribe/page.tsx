import { initLingui } from '@/initLingui'
import { getSite, getTiers } from '@/lib/fetchers'
import { Trans } from '@lingui/react'
import Image from 'next/image'
import { Profile } from '@penx/components/Profile'
import linguiConfig from '@penx/libs/lingui.config'
import { AppearanceConfig } from '@penx/types'
import { GoBackButton } from './GoBackButton'
import { TierList } from './TierList'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function HomePage(props: {
  params: Promise<{ domain: string; lang: string }>
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

  const tiers = await getTiers(site.id)

  return (
    <div>
      <div className="flex items-center justify-between p-2">
        <GoBackButton />
        <Profile></Profile>
      </div>

      <div className="flex flex-col items-center space-x-2 pt-8">
        {site.logo && (
          <Image
            src={site.logo}
            alt="avatar"
            width={192}
            height={192}
            className="h-20 w-20 rounded-full"
          />
        )}
        <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
          {site.name}
        </h3>
      </div>

      <div className="flex flex-col items-center gap-10 space-x-2 pt-8">
        <div className="text-center text-4xl font-bold">
          <Trans id="Choose a subscription plan"></Trans>
        </div>

        <TierList tiers={tiers} site={site} />
      </div>
    </div>
  )
}
