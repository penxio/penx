'use client'

import TextareaAutosize from 'react-textarea-autosize'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { updateCreation } from '@penx/hooks/useCreation'
import {
  refetchCreations,
  updateCreationById,
  useCreations,
} from '@penx/hooks/useCreations'
import { ICreation } from '@penx/model/ICreation'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { cn } from '@penx/utils'

interface PostItemProps {
  creation: ICreation
}

export function TaskItem({ creation: creation }: PostItemProps) {
  const site = useSiteContext()
  return (
    <div className={cn('flex break-inside-avoid flex-col rounded-2xl')}>
      <div className="flex items-center gap-2">
        <Checkbox
          className="size-5"
          checked={creation.checked}
          onCheckedChange={(v) => {
            updateCreation({
              id: creation.id,
              checked: v as any,
            })
          }}
        />

        <TextareaAutosize
          className="dark:placeholder-text-600 placeholder:text-foreground/40 w-full resize-none border-none bg-transparent px-0 text-xl font-bold focus:outline-none focus:ring-0"
          placeholder="Title"
          defaultValue={creation.title || ''}
          autoFocus
          onChange={(e) => {
            const title = e.target.value
            updateCreation({ id: creation.id, title })
            updateCreationById(creation.areaId!, creation.id, { title })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        />
      </div>
    </div>
  )
}
