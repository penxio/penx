'use client'

import { createContext, PropsWithChildren, useContext } from 'react'

export const CreationContext = createContext({} as any)

interface Props {
  creation: any
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
