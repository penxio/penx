'use client'

import { ReactNode } from 'react'
import { Trans } from '@lingui/react'
import { ChevronLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { SiteLink } from '@penx/components/SiteLink'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { Link } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { SettingNav } from './SettingNav'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: ReactNode }) {
  const { session } = useSession()
  const { isLoading } = useQuerySite()
  const searchParams = useSearchParams()!
  const from = searchParams?.get('from')
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }
  return (
    <div className="flex flex-col md:mx-auto">
      <div className="border-foreground/10 bg-background sticky top-0 z-20 flex h-[48px] flex-col gap-2 border-b px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1">
          <Link
            href={`/~`}
            className="text-foreground bg-accent inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="text-xl font-bold">
            <Trans id="Settings"></Trans>
          </div>
        </div>
        {/* <div className="hidden sm:block">
          <SiteLink />
        </div> */}
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 md:flex-row">
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
