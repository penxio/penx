'use client'

import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { isMobileApp } from '@penx/constants'
import { Area } from '@penx/domain'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useMolds } from '@penx/hooks/useMolds'
import { CreationType, Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { NoteInput } from '../DashboardLayout/panel-renderer/Notes/NoteInput'
import { TaskInput } from '../DashboardLayout/panel-renderer/Tasks/TaskInput'

interface Props {
  area: Area
  widget: Widget
}

export function AddCreationButton({ area, widget }: Props) {
  const { molds } = useMolds()
  const addCreation = useAddCreation()
  const mold = molds.find((mold) => mold.id === widget.moldId)!
  const [showInput, setShowInput] = useState(false)

  if (
    [CreationType.TASK, CreationType.NOTE].includes(mold.type as CreationType)
  ) {
    return (
      <Popover open={showInput} onOpenChange={setShowInput}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'inline-flex size-6 items-center justify-center rounded-md p-0',
              isMobileApp && 'size-8',
            )}
          >
            <PlusIcon
              className={cn(
                'text-muted-foreground pointer-events-none size-4 transition-transform duration-200',
                isMobileApp && 'size-5',
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          isPortal
          className="inline-flex w-auto border-none bg-transparent p-0 px-0 shadow-none"
          // asChild
        >
          {mold.type === CreationType.NOTE && (
            <NoteInput
              className="shadow-2xl"
              onSubmit={() => {
                setShowInput(false)
              }}
            />
          )}

          {mold.type === CreationType.TASK && (
            <TaskInput
              className="shadow-2xl"
              onSubmit={() => {
                setShowInput(false)
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'inline-flex size-6 items-center justify-center rounded-md p-0',
        isMobileApp && 'size-8',
      )}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={async (e) => {
        e.stopPropagation()
        e.preventDefault()
        const mold = molds.find((mold) => mold.id === widget.moldId)!
        addCreation({ type: mold.type })
      }}
    >
      <PlusIcon
        className={cn(
          'text-muted-foreground pointer-events-none size-4 transition-transform duration-200',
          isMobileApp && 'size-5',
        )}
      />
    </Button>
  )
}
