'use client'

import { Mold } from '@prisma/client'
import { useNotes } from '@penx/hooks/useNotes'
import { Panel } from '@penx/types'
import { NoteItem } from './NoteItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
}

export function NoteList({ mold }: PostListProps) {
  const notes = useNotes()

  return (
    <div className="flex w-full flex-col gap-2">
      {notes.map((note) => {
        return <NoteItem key={note.id} creation={note} />
      })}
    </div>
  )
}
