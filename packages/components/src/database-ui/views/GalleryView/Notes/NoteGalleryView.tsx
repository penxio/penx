'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Struct } from '@penx/domain'
import { useNotes } from '@penx/hooks/useNotes'
import { Panel } from '@penx/types'
import { NoteInput } from './NoteInput'
import { NoteItem } from './NoteItem'
import { NoteList } from './NoteList'

interface PostListProps {
  struct: Struct
}

export function NoteGalleryView({ struct }: PostListProps) {
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
    <div ref={ref} className="relative flex-1">
      <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full flex-1 flex-col">
        <div
          className="flex-1 gap-x-2 overflow-auto px-4 pb-20 pt-6"
          style={{ columnCount: columns }}
        >
          <NoteList />
        </div>

        <div className="px-6 pb-2">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
            <NoteInput />
          </div>
        </div>
      </div>
    </div>
  )
}
