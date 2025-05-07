'use client'

import React from 'react'
import { ChevronRightIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { isMobileApp } from '@penx/constants'
import { Area } from '@penx/db/client'
import { IArea } from '@penx/model-type/IArea'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { cn } from '@penx/utils'

interface Props {
  area: IArea
  widget: Widget
}

export function ToggleButton({ area, widget }: Props) {
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
