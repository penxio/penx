'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Area } from '@/hooks/useAreaItem'
import { RouterOutputs } from '@/server/_app'

export type AreaItem = RouterOutputs['area']['byId']
export const areaContext = createContext({} as Area)

interface Props {
  area: Area
}

export const AreaContext = ({ area, children }: PropsWithChildren<Props>) => {
  return <areaContext.Provider value={area}>{children}</areaContext.Provider>
}

export function useAreaContext() {
  return useContext(areaContext)
}
