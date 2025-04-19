'use client'

import React from 'react'
import { Button } from '@penx/uikit/ui/button'
import { toggleCollapsed } from '@/hooks/useAreaItem'
import { Widget } from '@/lib/types'
import { Area } from '@penx/db/client'
import { ChevronRightIcon } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
  area: Area
  widget: Widget
}

export function ToggleButton({ area, widget }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="inline-flex size-6 items-center justify-center rounded-md p-0"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={async (e) => {
        e.stopPropagation()
        e.preventDefault()
        await toggleCollapsed(area.id, widget.id)
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
        <ChevronRightIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
      </motion.div>
    </Button>
  )
}
