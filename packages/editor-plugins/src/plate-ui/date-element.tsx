'use client'

import { Calendar } from './calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'
import { cn } from '@penx/utils'
import type { TDateElement } from '@udecode/plate-date'
import type { PlateElementProps } from '@udecode/plate/react'
import { PlateElement, useReadOnly } from '@udecode/plate/react'

export function DateElement(props: PlateElementProps<TDateElement>) {
  const { editor, element } = props

  const readOnly = useReadOnly()

  const trigger = (
    <span
      className={cn(
        'bg-muted text-muted-foreground w-fit cursor-pointer rounded-sm px-1',
      )}
      contentEditable={false}
      draggable
    >
      {element.date ? (
        (() => {
          const today = new Date()
          const elementDate = new Date(element.date)
          const isToday =
            elementDate.getDate() === today.getDate() &&
            elementDate.getMonth() === today.getMonth() &&
            elementDate.getFullYear() === today.getFullYear()

          const isYesterday =
            new Date(today.setDate(today.getDate() - 1)).toDateString() ===
            elementDate.toDateString()
          const isTomorrow =
            new Date(today.setDate(today.getDate() + 2)).toDateString() ===
            elementDate.toDateString()

          if (isToday) return 'Today'
          if (isYesterday) return 'Yesterday'
          if (isTomorrow) return 'Tomorrow'

          return elementDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        })()
      ) : (
        <span>Pick a date</span>
      )}
    </span>
  )

  if (readOnly) {
    return trigger
  }

  return (
    <PlateElement
      {...props}
      className="inline-block"
      attributes={{
        ...props.attributes,
        contentEditable: false,
      }}
    >
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selected={new Date(element.date as string)}
            onSelect={(date) => {
              if (!date) return

              editor.tf.setNodes({ date: date.toDateString() }, { at: element })
            }}
            mode="single"
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {props.children}
    </PlateElement>
  )
}
