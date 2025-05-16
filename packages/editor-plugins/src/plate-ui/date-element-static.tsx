import * as React from 'react'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import type { TDateElement } from '@udecode/plate-date'

export function DateElementStatic(props: SlateElementProps<TDateElement>) {
  const { element } = props

  return (
    <SlateElement className="inline-block" {...props}>
      <span className="bg-muted text-muted-foreground w-fit rounded-sm px-1">
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
      {props.children}
    </SlateElement>
  )
}
