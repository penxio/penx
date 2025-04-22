import { produce } from 'immer'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { CreationType } from '@penx/types'

export function useNotes() {
  const creations = useAreaCreationsContext()
  const notes = produce(creations, (draft) => {
    return draft.filter((creation) => creation.type === CreationType.NOTE)
  })
  return notes
}
