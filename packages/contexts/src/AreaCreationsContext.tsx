'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { ICreation } from '@penx/model-type/ICreation'

export const AreaCreationsContext = createContext([] as ICreation[])

interface Props {
  creations: ICreation[]
}

export const AreaCreationsProvider = ({
  creations,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <AreaCreationsContext.Provider value={creations}>
      {children}
    </AreaCreationsContext.Provider>
  )
}

export function useAreaCreationsContext() {
  return useContext(AreaCreationsContext)
}
