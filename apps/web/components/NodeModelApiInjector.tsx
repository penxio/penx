'use client'

import { PropsWithChildren, useEffect, useMemo } from 'react'
import { initIDBNodeModelApi } from '@penx/libs/initIDBNodeModelApi'

export function NodeModelApiInjector({ children }: PropsWithChildren) {
  useMemo(() => {
    console.log('=======initNodeModelApi......')
    initIDBNodeModelApi()
  }, [])

  if (!window.nodeModelApi) return null
  return <>{children}</>
}
