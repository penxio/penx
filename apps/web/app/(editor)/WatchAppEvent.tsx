'use client'

import { useEffect } from 'react'
import { useRouter } from '@/lib/i18n'
import { appEmitter } from '@penx/emitter'

export function WatchAppEvent() {
  const { push } = useRouter()
  useEffect(() => {
    appEmitter.on('ON_LOGOUT_SUCCESS', () => {
      push('/')
    })

    appEmitter.on('ROUTE_TO_SETTINGS', () => {
      push('/~/settings')
    })

    appEmitter.on('ROUTE_TO_DESIGN', () => {
      push('/~/design')
    })
  }, [push])
  return null
}
