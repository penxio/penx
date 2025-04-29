'use client'

import { useEffect, useRef, useState } from 'react'
import { Mold } from '@penx/db/client'
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
  const ref = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    if (!ref.current) return
    function updateWidth() {
      if (!ref.current) return
      const newWidth = ref.current.getBoundingClientRect().width
      if (newWidth < 500) {
        setColumns(1)
      } else if (newWidth < 900) {
        setColumns(2)
      } else if (newWidth < 1300) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(ref.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex-1 gap-x-2" style={{ columnCount: columns }}>
      {notes.map((note) => {
        return <NoteItem key={note.id} creation={note} />
      })}
    </div>
  )
}
