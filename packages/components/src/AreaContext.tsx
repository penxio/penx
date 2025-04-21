'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { AreaById } from '@penx/types'

export const areaContext = createContext({} as AreaById)

interface Props {
  area: AreaById
}

export const AreaContext = ({ area, children }: PropsWithChildren<Props>) => {
  return <areaContext.Provider value={area}>{children}</areaContext.Provider>
}

export function useAreaContext() {
  return useContext(areaContext)
}
