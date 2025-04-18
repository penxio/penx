'use client'

import { createContext, PropsWithChildren, useContext } from 'react'

export const IsAllContext = createContext(false)

interface Props {
  isAll?: boolean
}

export const IsAllProvider = ({
  isAll = false,
  children,
}: PropsWithChildren<Props>) => {
  return <IsAllContext.Provider value={isAll}>{children}</IsAllContext.Provider>
}

export function useIsAllContext() {
  return useContext(IsAllContext)
}
