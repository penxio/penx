'use client'

import React, { forwardRef, memo, ReactNode, useEffect, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react'
import { AnimatePresence, motion } from 'motion/react'
import { Drawer } from 'vaul'
import { isMobileApp, WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { useMolds } from '@penx/hooks/useMolds'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { ContextMenu, ContextMenuTrigger } from '@penx/uikit/context-menu'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { cn } from '@penx/utils'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { WidgetName } from '@penx/widgets/WidgetName'
import { QuickInput } from '../QuickInput'
import { AddCreationButton } from './AddCreationButton'
import { AllCreationCard } from './AllCreationCard'
import { IsAllProvider } from './IsAllContext'
import { TitleContextMenu } from './TitleContextMenu'
import { ToggleButton } from './ToggleButton'
import { WidgetRender } from './WidgetRender'

interface Props {
  dragging?: boolean
  dragOverlay?: boolean
  isDragging?: boolean
  isSorting?: boolean
  dragLine?: ReactNode

  /** for drag handle */
  listeners?: DraggableSyntheticListeners

  /** for drag handle */
  attributes?: any

  id: string

  index?: number

  style?: any

  widget: Widget
}

export const WidgetItem = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const {
      widget,
      index,
      id,
      dragOverlay,
      isDragging,
      isSorting,
      attributes,
      listeners,
      dragLine,
      ...rest
    } = props

    const { molds } = useMolds()
    const { area } = useArea()
    const [visible, setVisible] = useState(false)

    // useEffect(() => {
    //   if (!dragOverlay) {
    //     return
    //   }

    //   document.body.style.cursor = 'grabbing'

    //   return () => {
    //     document.body.style.cursor = ''
    //   }
    // }, [dragOverlay])

    if (!widget) return null

    if (widget.type === WidgetType.QUICK_INPUT) {
      return (
        <div
          ref={ref}
          className="flex"
          {...rest}
          {...attributes}
          {...listeners}
        >
          <QuickInput />
        </div>
      )
    }

    const titleJSX = (
      <div
        className={cn(
          'relative flex h-10 cursor-pointer select-none items-center justify-between pl-3 pr-2',
          isMobileApp && 'h-11',
        )}
        {...attributes}
        {...listeners}
        onClick={() => {
          if (isMobileApp) {
            setVisible(true)
            return
          }

          if (widget.type === WidgetType.AI_CHAT) {
            store.panels.openWidgetPanel(widget)
            return
          }

          setVisible(!visible)
        }}
      >
        <div className="flex items-center gap-1">
          {/* <WidgetIcon type={widget.type} molds={molds} /> */}
          <div className="text-foreground select-none text-base font-semibold">
            <WidgetName widget={widget} molds={molds} />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5',
            !isMobileApp && 'opacity-0 group-hover/widget:opacity-100',
          )}
        >
          {widget.type === WidgetType.MOLD && (
            <AddCreationButton area={area} widget={widget} />
          )}

          <ToggleButton area={area} widget={widget} />
        </div>
      </div>
    )

    return (
      <>
        <div
          ref={ref}
          className={cn(
            'group/widget relative flex flex-col',
            isDragging && 'bg-foreground/6 opacity-50',
            isDragging && 'z-[1000000]',
            dragOverlay && 'shadow',
            !isMobileApp && 'shadow-2xs rounded-md bg-white dark:bg-[#181818]',
          )}
          {...rest}
        >
          {dragLine}
          {!isMobileApp && (
            <ContextMenu>
              <ContextMenuTrigger>{titleJSX}</ContextMenuTrigger>
              <TitleContextMenu
                widget={widget}
                onShowAll={() => setVisible(!visible)}
                onOpenInPanel={() => {
                  store.panels.openWidgetPanel(widget)
                }}
              />
            </ContextMenu>
          )}

          {isMobileApp && titleJSX}
          <AnimatePresence initial={false}>
            {!widget.collapsed ? (
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
              >
                <IsAllProvider>
                  <WidgetRender widget={widget} />
                </IsAllProvider>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {!isMobileApp && (
          <AllCreationCard
            name={<WidgetName widget={widget} molds={molds} />}
            visible={visible}
            setVisible={setVisible}
            widget={widget}
          />
        )}
        {isMobileApp && (
          <Drawer.Root open={visible} onOpenChange={setVisible}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-background text-foreground fixed bottom-0 left-0 right-0 mt-24 flex h-fit max-h-[90vh] min-h-[90vh] flex-col rounded-t-[10px] px-0 pb-0 outline-none">
                <div
                  aria-hidden
                  className="mx-auto mb-4 mt-2 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
                />

                <DialogTitle className="hidden">
                  <DialogDescription></DialogDescription>
                </DialogTitle>
                <div className="mb-2 flex items-center justify-center font-bold">
                  <WidgetName widget={widget} molds={molds} />
                </div>
                <div className="">
                  <IsAllProvider isAll setVisible={setVisible}>
                    <WidgetRender widget={widget} />
                  </IsAllProvider>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
      </>
    )
  },
)
