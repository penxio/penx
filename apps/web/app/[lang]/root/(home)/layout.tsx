import { PropsWithChildren } from 'react'
import { SocialNav } from '@/components/SocialNav'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import { initLingui } from '@/initLingui'
import { Link } from '@/lib/i18n'
import linguiConfig from '@/lingui.config'
import { DeployOwnButton } from './DeployOwnButton'
import { InstallExtensionButton } from './InstallExtensionButton'
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
      <div>
        <SocialNav />
        <Slogan></Slogan>
      </div>
      {/* <div className="flex gap-2 justify-center mb-4 mx-8 sm:mx-0 flex-wrap">
        <Badge size="lg" variant="feature">
          Web3
        </Badge>

        <Badge size="lg" variant="feature">
          Blog tokenize
        </Badge>

        <Badge size="lg" variant="feature">
          own your data
        </Badge>

        <Badge size="lg" variant="feature">
          Modern
        </Badge>
      </div> */}
      <div className="flex items-center justify-center gap-3">
        <StartWritingButton />
        {/* <DeployOwnButton /> */}
        <InstallExtensionButton />
      </div>

      {children}
    </div>
  )
}
