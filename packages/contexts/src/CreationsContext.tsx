'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { ICreation } from '@penx/model-type/ICreation'

interface Props {
  creations: ICreation[]
  backLinkCreations: ICreation[]
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
