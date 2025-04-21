'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { CreationById } from '@penx/types'

interface Props {
  creations: CreationById[]
  backLinkCreations: CreationById[]
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
