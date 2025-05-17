'use client'

import React, { ReactNode } from 'react'
import { XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { IsAllProvider } from './IsAllContext'
import { WidgetRender } from './WidgetRender'

interface Props {
  name: ReactNode
  visible: boolean
  setVisible: any
  widget: Widget
}

export function StructCreationsCard({
  name,
  visible,
  setVisible,
  widget,
}: Props) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ left: -240 }}
          animate={{ left: 8 }}
          exit={{ left: -240 }}
          className="bg-background fixed bottom-2 left-[8px] top-2 z-50 flex w-[240px] flex-col rounded-md shadow-lg dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between gap-1 px-3 py-2">
            <div className="select-none text-sm font-semibold">{name}</div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 rounded-md"
              onClick={() => {
                setVisible(false)
              }}
            >
              <XIcon size={16} className="text-foreground/60"></XIcon>
            </Button>
          </div>

          <div className="flex-1 overflow-auto">
            <IsAllProvider isAll>
              <WidgetRender widget={widget} />
            </IsAllProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
