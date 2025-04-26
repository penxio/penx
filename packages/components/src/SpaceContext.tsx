'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { Space } from '@penx/domain/Space'
import { Site, SpaceType } from '@penx/types'

export const SpaceContext = createContext<Space>({} as Space)

interface Props {
  space: SpaceType
  site: Site
}

export const SpaceProvider = ({
  space,
  site,
  children,
}: PropsWithChildren<Props>) => {
  useEffect(() => {
    ;(window as any).__SITE__ = site as any
  }, [site])
  return (
    <SpaceContext.Provider value={new Space(space)}>
      {children}
    </SpaceContext.Provider>
  )
}

export function useSpaceContext() {
  return useContext(SpaceContext)
}
