'use client'

import { useQuery } from '@tanstack/react-query'
import { useNotes } from '@penx/hooks/useNotes'
import { NoteItem } from './NoteItem'

export function NoteList() {
  const notes = useNotes()

  // TODO:
  const { isLoading, isFetching } = useQuery({
    queryKey: ['notes', 'loading'],
    queryFn: async () => 0,
  })

  if (isLoading || isFetching) return <div></div>

  return (
    <>
      {notes.map((note) => {
        return <NoteItem key={note.id} creation={note} />
      })}
    </>
  )
}
