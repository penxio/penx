'use client'

import React, { ReactNode } from 'react'
import { XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { WidgetType } from '@penx/constants'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { PanelType, Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { uniqueId } from '@penx/unique-id'
import { IsAllProvider } from './IsAllContext'
import { WidgetRender } from './WidgetRender'

interface Props {
  name: ReactNode
  visible: boolean
  setVisible: any
  widget: Widget
  struct?: Struct
}

export function AllCreationCard({
  name,
  visible,
  setVisible,
  widget,
  struct,
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
            <div className="flex items-center gap-2">
              <div className="select-none text-sm font-semibold">
                {struct ? struct.name : name}
              </div>

              {struct && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-6 rounded-md px-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          store.panels.openWidgetPanel({
                            id: uniqueId(),
                            type: PanelType.WIDGET,
                            structId: struct.id,
                          })
                        }}
                      >
                        Open
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open in new panel</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
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
              <WidgetRender
                widget={
                  struct
                    ? {
                        ...widget,
                        structId: struct.id,
                        type: WidgetType.STRUCT,
                      }
                    : widget
                }
              />
            </IsAllProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
