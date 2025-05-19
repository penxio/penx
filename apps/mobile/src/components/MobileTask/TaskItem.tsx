'use client'

import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Creation } from '@penx/domain'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import { cn } from '@penx/utils'

interface PostItemProps {
  creation: Creation
}

export function TaskItem({ creation }: PostItemProps) {
  const [checked, setChecked] = useState(creation.checked)

  useEffect(() => {
    if (checked !== creation.checked) {
      setChecked(creation.checked)
    }
  }, [creation.checked])

  return (
    <div
      className={cn(
        'hover:text-brand text-foreground flex cursor-pointer break-inside-avoid flex-col rounded-md py-1 text-base transition-all hover:font-bold',
      )}
      onClick={() => {
        // store.panels.updateMainPanel({
        //   type: PanelType.CREATION,
        //   creationId: creation.id,
        // })
      }}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          className="size-5"
          checked={checked}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={(v) => {
            console.log('=====v:', v)

            setChecked(v as any)
            setTimeout(() => {
              updateCreationProps(creation.id, {
                checked: v as any,
              })
            }, 1000)
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
