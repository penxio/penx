'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { ITag } from '@penx/model-type/ITag'

export const TagContext = createContext([] as ITag[])

interface Props {
  tags: ITag[]
}

export const TagsProvider = ({ tags, children }: PropsWithChildren<Props>) => {
  return <TagContext.Provider value={[...tags]}>{children}</TagContext.Provider>
}

export function useTagsContext() {
  const list = useContext(TagContext)
  return list
}
