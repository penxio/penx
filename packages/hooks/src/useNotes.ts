import { produce } from 'immer'
import { useCreations } from '@penx/hooks/useCreations'
import { StructType } from '@penx/types'

export function useNotes() {
  const { creations } = useCreations()
  const notes = produce(creations, (draft) => {
    return draft
      .filter((creation) => creation.type === StructType.NOTE)
      .sort((a, b) => {
        return new Date(b.updatedAt).getTime() - a.updatedAt.getTime()
      })
  })
  return notes
}
