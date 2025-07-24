'use client'

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { set } from 'idb-keyval'
import { useSearchParams } from 'next/navigation'
import { api } from '@penx/api'
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
import {
  getAddress,
  getNewMnemonic,
  getPublicKey,
  setMnemonicToLocal,
} from '@penx/mnemonic'
import { queryClient } from '@penx/query-client'
import { refreshSession, useSession } from '@penx/session'
import { cn } from '@penx/utils'
import { DeleteStructDialog } from '../DeleteStructDialog/DeleteStructDialog'
import { PlanListDialog } from '../PlanList/PlanListDialog'
import { PublishStructDialog } from '../PublishStructDialog/PublishStructDialog'
import { SettingsDialog } from '../SettingsDialog/SettingsDialog'
import { SubscriptionGuideDialog } from '../SettingsDialog/SubscriptionGuideDialog'
import { StructDialog } from '../StructDialog/StructDialog'
import { PanelLayout } from './PanelLayout'
import { SettingsLayout } from './SettingsLayout'
import 'react-datepicker/dist/react-datepicker.css'

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

  const { session } = useSession()

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

  const doingRef = useRef(false)
  const initMnemonic = useCallback(async () => {
    try {
      const mnemonic = await getNewMnemonic()
      const publicKey = getPublicKey(mnemonic)
      const address = getAddress(mnemonic)
      await api.updatePublicKey({
        mnemonic,
        publicKey,
        address,
      })
      await setMnemonicToLocal(session.spaceId!, mnemonic)
      // store.user.setMnemonic(mnemonic)
      refreshSession()
    } catch (error) {
      console.log('=====error:', error)
    }
  }, [session])

  useEffect(() => {
    if (!session || session.publicKey || doingRef.current) return
    console.log('init=======session:', session)
    doingRef.current = true
    initMnemonic()
  }, [session])

  return (
    <>
      <SubscriptionGuideDialog />
      <CommandPanel />
      <PublishStructDialog />
      <PlanListDialog />
      <DeleteStructDialog />
      <SettingsDialog />
      {isDesign && children}
      {!isDesign && <Layout>{children}</Layout>}
    </>
  )
}
