'use client'

import { PropsWithChildren, useEffect, useMemo } from 'react'
import { initNodeModelApi } from '@/lib/initNodeModelApi'

export function NodeModelApiInjector({ children }: PropsWithChildren) {
  useMemo(() => {
    console.log('=======initNodeModelApi......')
    initNodeModelApi()
  }, [])

  if (!window.nodeModelApi) return null
  return <>{children}</>
}
