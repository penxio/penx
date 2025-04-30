'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { IMold } from '@penx/model-type/IMold'
import { CreationType } from '@penx/types'

export const MoldsContext = createContext([] as IMold[])

interface Props {
  molds: IMold[]
}

export const MoldsProvider = ({
  molds,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <MoldsContext.Provider value={[...molds]}>{children}</MoldsContext.Provider>
  )
}

export function useMoldsContext() {
  const list = useContext(MoldsContext)
  const sortKeys = [
    CreationType.ARTICLE,
    CreationType.NOTE,
    CreationType.AUDIO,
    CreationType.IMAGE,
    CreationType.BOOKMARK,
    CreationType.FRIEND,
    CreationType.PROJECT,
  ]

  return list.sort((a, b) => {
    const indexA = sortKeys.indexOf(a.type as any)
    const indexB = sortKeys.indexOf(b.type as any)
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return 0
  })
}
