'use client'

import { ReactNode } from 'react'
import { useSession } from '@penx/session'
import { SiteLink } from '@penx/components/SiteLink'
import { Link } from '@penx/libs/i18n'
import { Trans } from '@lingui/react/macro'
import { ChevronLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { SettingNav } from './SettingNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  const { session } = useSession()
  const searchParams = useSearchParams()!
  const from = searchParams?.get('from')
  return (
    <div className="flex flex-col md:mx-auto">
      <div className="border-foreground/10 bg-background sticky top-0 z-20 flex h-[48px] flex-col gap-2 border-b px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1">
          <Link
            href={
              // from
              //   ? decodeURIComponent(from)
              //   : `/~/areas/${session?.activeAreaId}`
              `/~/areas/${session?.activeAreaId}`
            }
            className="text-foreground bg-accent inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="text-xl font-bold">
            <Trans>Settings</Trans>
          </div>
        </div>
        <div className="hidden sm:block">
          <SiteLink />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 md:flex-row">
        <SettingNav />
        <div
          className="flex-1 overflow-auto px-4 pt-8"
          style={{
            height: 'calc(100vh - 48px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
