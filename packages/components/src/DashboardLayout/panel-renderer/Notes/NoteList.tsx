'use client'

import { useQuery } from '@tanstack/react-query'
import { Mold } from '@penx/domain'
import { useNotes } from '@penx/hooks/useNotes'
import { Panel } from '@penx/types'
import { NoteItem } from './NoteItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
  columnCount: number
}

export function NoteList({ mold, columnCount }: PostListProps) {
  const notes = useNotes()

  const { isLoading, isFetching } = useQuery({
    queryKey: ['notes', 'loading'],
    queryFn: async () => 0,
  })

  // TODO: need to use virtual
  if (isLoading || isFetching) return <div></div>

  return (
    <div className="flex-1 gap-x-2" style={{ columnCount }}>
      {notes.map((note) => {
        return <NoteItem key={note.id} creation={note} />
      })}
    </div>
  )
}
