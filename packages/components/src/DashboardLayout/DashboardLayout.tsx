'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { set } from 'idb-keyval'
import { useSearchParams } from 'next/navigation'
import { AreaDialog } from '@penx/components/AreaDialog'
import { CommandPanel } from '@penx/components/CommandPanel'
import {
  isBrowser,
  isMobileApp,
  isServer,
  SIDEBAR_WIDTH,
} from '@penx/constants'
// import { runWorker } from '@/lib/worker'
import { appEmitter } from '@penx/emitter'
import { usePathname } from '@penx/libs/i18n'
import { queryClient } from '@penx/query-client'
import { useSession } from '@penx/session'
import { cn } from '@penx/utils'
import { DeleteStructDialog } from '../DeleteStructDialog/DeleteStructDialog'
import { PlanListDialog } from '../PlanList/PlanListDialog'
import { PublishStructDialog } from '../PublishStructDialog/PublishStructDialog'
import { StructDialog } from '../StructDialog/StructDialog'
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

  const pathname = usePathname()!
  const isSettings = pathname.includes('/~/settings')
  const isDesign =
    pathname.includes('/~/design') || pathname.includes('/~/database')

  const Layout = isSettings ? SettingsLayout : PanelLayout

  // const Layout = PanelLayout

  // if (!areaCreations.data?.length) return null
  // if (!session) return null

  useEffect(() => {
    appEmitter.on('DESKTOP_LOGIN_SUCCESS', async (session) => {
      await set('SESSION', session)
      queryClient.setQueryData(['SESSION'], session)
      location.reload()
    })
  }, [])

  return (
    <>
      <CommandPanel />
      <PublishStructDialog />
      <PlanListDialog />
      <DeleteStructDialog />
      {isDesign && children}
      {!isDesign && <Layout>{children}</Layout>}
    </>
  )
}
