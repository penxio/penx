'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Creation } from '@/lib/theme.types'

export const CreationContext = createContext({} as Creation)

interface Props {
  creation: Creation
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
