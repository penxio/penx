'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { AreaContext } from '@/components/AreaContext'
import { AreaCreationsProvider } from '@/components/AreaCreationsContext'
import { AreaDialog } from '@/components/AreaDialog/AreaDialog'
import { CommandPanel } from '@/components/CommandPanel/CommandPanel'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSession } from '@/components/session'
import { SiteProvider } from '@/components/SiteContext'
import { SubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog/SubscriptionGuideDialog'
import { useAppLoading } from '@/hooks/useAppLoading'
import { useAreaCreations } from '@/hooks/useAreaCreations'
import { useAreaItem } from '@/hooks/useAreaItem'
import { useSite } from '@/hooks/useSite'
import { isBrowser, isServer, SIDEBAR_WIDTH } from '@/lib/constants'
import { usePathname } from '@/lib/i18n'
import { CreationType } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { runWorker } from '@/lib/worker'
import { Site } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { AppSidebar } from '../Sidebar/app-sidebar'
import { PanelLayout } from './PanelLayout'
import { PanelList } from './PanelList'
import { SettingsLayout } from './SettingsLayout'

let inited = false
if (!isServer) {
  setTimeout(() => {
    if (inited) return
    inited = true
    runWorker()
  }, 2000)
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { site, isLoading } = useSite()
  const field = useAreaItem()
  const areaCreations = useAreaCreations()
  const pathname = usePathname()!
  const isPanel = pathname?.includes('/~/areas/')

  if (!site || isLoading || field.isLoading || areaCreations.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    )
  }

  const Layout = isPanel ? PanelLayout : SettingsLayout

  if (!areaCreations.data?.length) return null

  return (
    <SiteProvider site={site as any}>
      <AreaContext area={field.data!}>
        <AreaCreationsProvider creations={areaCreations.data!}>
          <CommandPanel />
          <SubscriptionGuideDialog />
          <AreaDialog />
          <Layout>{children}</Layout>
        </AreaCreationsProvider>
      </AreaContext>
    </SiteProvider>
  )
}
