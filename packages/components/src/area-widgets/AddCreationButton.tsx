'use client'

import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { isMobileApp, WidgetType } from '@penx/constants'
import { Area } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { StructType, Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
import { NoteInput } from '../NoteInput'
import { TaskInput } from '../TaskInput'

interface Props {
  area: Area
  widget: Widget
}

export function AddCreationButton({ area, widget }: Props) {
  const { structs } = useStructs()
  const addCreation = useAddCreation()
  const struct = structs.find((struct) => struct.id === widget.structId)!
  const [showInput, setShowInput] = useState(false)
  const { close } = useMobileMenu()

  if (widget.type === WidgetType.ALL_STRUCTS && !isMobileApp) return null

  if ([StructType.TASK, StructType.NOTE].includes(struct?.type as StructType)) {
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
          className="inline-flex w-auto border-none p-0 px-0  ring-0"
        >
          <>
            {struct.type === StructType.NOTE && (
              <NoteInput
                className="shadow-none"
                onSubmit={() => {
                  setShowInput(false)
                }}
              />
            )}

            {struct.type === StructType.TASK && (
              <TaskInput
                className="shadow-none"
                onSubmit={() => {
                  setShowInput(false)
                }}
              />
            )}
          </>
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

        if (isMobileApp) {
          close()
          return
        }
        const struct = structs.find((struct) => struct.id === widget.structId)!
        addCreation({ type: struct.type })
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
