'use client'

import TextareaAutosize from 'react-textarea-autosize'
import { Creation } from '@penx/domain'
import { updateCreation } from '@penx/hooks/useCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { cn } from '@penx/utils'

interface PostItemProps {
  creation: Creation
}

export function TaskItem({ creation: creation }: PostItemProps) {
  return (
    <div
      className={cn(
        'hover:text-brand text-foreground flex cursor-pointer break-inside-avoid flex-col rounded-md py-1 text-base transition-all hover:font-bold',
      )}
      onClick={() => {
        store.panels.updateMainPanel({
          type: PanelType.CREATION,
          creationId: creation.id,
        })
      }}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          className="size-5"
          checked={creation.checked}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(v) => {
            updateCreation({
              id: creation.id,
              checked: v as any,
            })
          }}
        />

        <div
          className={cn(creation.checked && 'text-foreground/60 line-through')}
        >
          {creation.title || ''}
        </div>
      </div>
    </div>
  )
}
