'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { SiteCreation } from '@/lib/types'

export const AreaCreationsContext = createContext([] as SiteCreation[])

interface Props {
  creations: SiteCreation[]
}

export const AreaCreationsProvider = ({
  creations,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <AreaCreationsContext.Provider value={[...creations]}>
      {children}
    </AreaCreationsContext.Provider>
  )
}

export function useAreaCreationsContext() {
  return useContext(AreaCreationsContext)
}
