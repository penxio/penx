import { PropsWithChildren } from 'react'
import { initLingui } from '@/initLingui'
import Link from 'next/link'
import { SocialNav } from '@penx/components/SocialNav'
import linguiConfig from '@penx/libs/lingui.config'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { DeployOwnButton } from './DeployOwnButton'
import { InstallExtensionButton } from './InstallExtensionButton'
import { LaunchButton } from './LaunchButton'
import { SiteCount } from './SiteCount'
import { Slogan } from './Slogan'
import { StartWritingButton } from './StartWritingButton'

export const dynamic = 'force-static'
export const revalidate = 86400 // 3600 * 24 * 365

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function HomePage({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ domain: string; lang: string }>
}>) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang
  initLingui(locale)
  return (
    <div className="relative flex flex-col justify-center gap-8 pb-20 pt-5 md:pt-32">
      <div className="space-y-3">
        <SocialNav />
        <Slogan></Slogan>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-3">
          <Link href="/~" target="_blank">
            <LaunchButton platform="desktop">
              <span className="icon-[solar--global-outline] text-brand size-5"></span>
              <span>Web App</span>
            </LaunchButton>
          </Link>

          <Link href="https://github.com/penxio/penx/releases" target="_blank">
            <LaunchButton>
              <span className="icon-[uil--desktop] size-5 text-sky-500"></span>
              <span>Desktop App</span>
            </LaunchButton>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3">
          <LaunchButton className="">
            <span className="icon-[ic--baseline-apple] size-6"></span>
            <span>iPhone</span>
          </LaunchButton>
          <LaunchButton className="">
            <span className="icon-[material-symbols--android] size-6 text-green-500"></span>
            <span>Android</span>
          </LaunchButton>
        </div>
        {/* <StartWritingButton /> */}
        {/* <DeployOwnButton /> */}
        {/* <InstallExtensionButton /> */}
      </div>

      {children}
    </div>
  )
}
