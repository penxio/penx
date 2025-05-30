'use client'

import React from 'react'
import { ChevronRightIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { isMobileApp, WidgetType } from '@penx/constants'
import { Area, Creation } from '@penx/domain'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

interface Props {
  area: Area
  widget: Widget
}

export function ToggleButton({ area, widget }: Props) {
  if (isMobileApp) {
    if (widget.type !== WidgetType.ALL_STRUCTS) return null
  }

  if (
    [WidgetType.AI_CHAT, WidgetType.JOURNAL].includes(widget.type as WidgetType)
  ) {
    return null
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
        await store.area.toggleCollapsed(widget.id)
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <motion.div
        initial="closed"
        variants={{
          open: {
            rotate: 90,
            transition: {
              duration: 0.2,
            },
          },
          closed: {
            rotate: 0,
            transition: {
              duration: 0.2,
            },
          },
        }}
        animate={widget.collapsed ? 'closed' : 'open'}
      >
        <ChevronRightIcon
          className={cn(
            'text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200',
            isMobileApp && 'size-5',
          )}
        />
      </motion.div>
    </Button>
  )
}
