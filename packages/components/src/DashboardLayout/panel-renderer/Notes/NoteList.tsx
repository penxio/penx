'use client'

import { useQuery } from '@tanstack/react-query'
import { Struct } from '@penx/domain'
import { useNotes } from '@penx/hooks/useNotes'
import { Panel } from '@penx/types'
import { NoteInput } from './NoteInput'
import { NoteItem } from './NoteItem'

interface PostListProps {
  struct: Struct
  panel: Panel
  index: number
  columnCount: number
}

export function NoteList({ struct, columnCount }: PostListProps) {
  const notes = useNotes()

  // TODO:
  const { isLoading, isFetching } = useQuery({
    queryKey: ['notes', 'loading'],
    queryFn: async () => 0,
  })
  if (isLoading || isFetching) return <div></div>

  return (
    <div className="flex h-full flex-1 flex-col">
      <div
        className="flex-1 gap-x-2 overflow-auto px-4"
        style={{ columnCount }}
      >
        {notes.map((note) => {
          return <NoteItem key={note.id} creation={note} />
        })}
      </div>

      <div className="px-6 pb-2">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          <NoteInput />
        </div>
      </div>
    </div>
  )
}
