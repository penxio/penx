'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Creation } from '@/lib/theme.types'

interface Props {
  creations: Creation[]
  backLinkCreations: Creation[]
}

export const CreationListContext = createContext({} as Props)

export const CreationListProvider = ({
  creations,
  backLinkCreations,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CreationListContext.Provider
      value={{
        creations: creations,
        backLinkCreations: backLinkCreations,
      }}
    >
      {children}
    </CreationListContext.Provider>
  )
}

export function useCreationListContext() {
  return useContext(CreationListContext)
}
