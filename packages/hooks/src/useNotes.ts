import { produce } from 'immer'
import { useCreations } from '@penx/hooks/useCreations'
import { CreationType } from '@penx/types'

export function useNotes() {
  const { creations } = useCreations()
  const notes = produce(creations, (draft) => {
    return draft
      .filter((creation) => creation.type === CreationType.NOTE)
      .sort((a, b) => {
        return new Date(b.updatedAt).getTime() - a.updatedAt.getTime()
      })
  })
  return notes
}
