'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { IArea } from '@penx/model-type/IArea'

export const areaContext = createContext({} as IArea)

interface Props {
  area: IArea
}

export const AreaProvider = ({ area, children }: PropsWithChildren<Props>) => {
  return <areaContext.Provider value={area}>{children}</areaContext.Provider>
}

export function useAreaContext() {
  return useContext(areaContext)
}
