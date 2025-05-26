'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { ICreationNode } from '@penx/model-type'

interface Props {
  creations: any[]
  backLinkCreations: any[]
}

export const CreationsContext = createContext({} as Props)

export const CreationsProvider = ({
  creations,
  backLinkCreations,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CreationsContext.Provider
      value={{
        creations,
        backLinkCreations,
      }}
    >
      {children}
    </CreationsContext.Provider>
  )
}

export function useCreationsContext() {
  return useContext(CreationsContext)
}
