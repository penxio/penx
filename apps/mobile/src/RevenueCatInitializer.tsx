import { useEffect, useRef } from 'react'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { checkSubscriptionStatus } from './lib/checkSubscriptionStatus'
import { initializeRevenueCat } from './lib/initializeRevenueCat'

export const RevenueCatInitializer = () => {
  const inited = useRef(false)
  const { session } = useSession()

  async function init() {
    await initializeRevenueCat(session.userId!)

    // checkSubscriptionStatus('standard')
    // checkSubscriptionStatus('pro')
  }

  useEffect(() => {
    if (inited.current) return
    if (!session) return

    init()

    inited.current = true
  }, [session])

  useEffect(() => {
    function handleInit(session: any) {
      initializeRevenueCat(session.userId!)
    }
    appEmitter.on('APP_LOGIN_SUCCESS', handleInit)
    return () => {
      appEmitter.off('APP_LOGIN_SUCCESS', handleInit)
    }
  }, [])

  return null
}
