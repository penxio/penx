'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { runWorker } from '@/lib/worker'
import { Site } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { AreaContext } from '@penx/components/AreaContext'
import { AreaDialog } from '@penx/components/AreaDialog/AreaDialog'
import { CommandPanel } from '@penx/components/CommandPanel/CommandPanel'
import { SubscriptionGuideDialog } from '@penx/components/SubscriptionGuideDialog/SubscriptionGuideDialog'
import { isBrowser, isServer, SIDEBAR_WIDTH } from '@penx/constants'
import { AreaCreationsProvider } from '@penx/contexts/AreaCreationsContext'
import { SiteProvider } from '@penx/contexts/SiteContext'
import { useAppLoading } from '@penx/hooks/useAppLoading'
import { useAreaCreations } from '@penx/hooks/useAreaCreations'
import { useAreaItem } from '@penx/hooks/useAreaItem'
import { useSite } from '@penx/hooks/useSite'
import { usePathname } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { CreationType } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { cn } from '@penx/utils'
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
        <AreaCreationsProvider creations={areaCreations.data! as any}>
          <CommandPanel />
          <SubscriptionGuideDialog />
          <AreaDialog />
          <Layout>{children}</Layout>
        </AreaCreationsProvider>
      </AreaContext>
    </SiteProvider>
  )
}
