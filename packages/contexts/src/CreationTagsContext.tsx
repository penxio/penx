'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { ICreationTag } from '@penx/model/ICreationTag'

export const CreationTagsContext = createContext([] as ICreationTag[])
interface Props {
  creationTags: ICreationTag[]
}

export const CreationTagsProvider = ({
  creationTags,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CreationTagsContext.Provider value={creationTags}>
      {children}
    </CreationTagsContext.Provider>
  )
}

export function useCreationTagsContext() {
  const creationTags = useContext(CreationTagsContext)
  return {
    creationTags,
    queryByCreation(creationId: string) {
      return creationTags
        .filter((tag) => tag.creationId === creationId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
    },
  }
}
