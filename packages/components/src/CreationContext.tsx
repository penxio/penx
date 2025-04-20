'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { CreationById } from '@penx/types'

export const CreationContext = createContext({} as CreationById)

interface Props {
  creation: CreationById
}

export const CreationProvider = ({
  creation,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CreationContext.Provider value={creation}>
      {children}
    </CreationContext.Provider>
  )
}

export function useCreationContext() {
  const creation = useContext(CreationContext)
  return creation
}
