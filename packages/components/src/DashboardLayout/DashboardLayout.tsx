'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AreaDialog } from '@penx/components/AreaDialog'
import { CommandPanel } from '@penx/components/CommandPanel'
import { isBrowser, isServer, SIDEBAR_WIDTH } from '@penx/constants'
// import { runWorker } from '@/lib/worker'
import { Site } from '@penx/db/client'
import { useDomains } from '@penx/hooks/useDomains'
import { usePathname } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { cn } from '@penx/utils'
import { PanelLayout } from './PanelLayout'
import { SettingsLayout } from './SettingsLayout'

// let inited = false
// if (!isServer) {
//   setTimeout(() => {
//     if (inited) return
//     inited = true
//     runWorker()
//   }, 2000)
// }

export function DashboardLayout({ children }: { children?: ReactNode }) {
  const domainsQuery = useDomains()

  const pathname = usePathname()!
  const isSettings = pathname.includes('/~/settings')
  const isDesign =
    pathname.includes('/~/design') || pathname.includes('/~/database')

  const Layout = isSettings ? SettingsLayout : PanelLayout
  // const Layout = PanelLayout

  // if (!areaCreations.data?.length) return null
  // if (!session) return null

  return (
    <>
      {/* <CommandPanel /> */}
      <AreaDialog />
      {isDesign && children}
      {!isDesign && <Layout>{children}</Layout>}
    </>
  )
}
