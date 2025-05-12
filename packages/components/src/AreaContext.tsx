'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Area } from '@penx/db/client'

export const areaContext = createContext({} as Area)

interface Props {
  area: Area
}

export const AreaProvider = ({ area, children }: PropsWithChildren<Props>) => {
  return <areaContext.Provider value={area}>{children}</areaContext.Provider>
}

export function useAreaContext() {
  return useContext(areaContext)
}
