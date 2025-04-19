'use client'

import { ArrowLeft, BookmarkPlusIcon } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { useAppType } from '../hooks/useAppType'
import { AddBookmarkForm } from './AddBookmarkForm'

export function AddBookmark() {
  const { setAppType } = useAppType()

  return (
    <div className="space-y-6 p-3">
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7"
          onClick={() => setAppType('')}
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-0.5">
          <BookmarkPlusIcon size={20} />
          <div className="font-semibold">Add bookmark</div>
        </div>
      </div>
      <div>
        <AddBookmarkForm />
      </div>
    </div>
  )
}
