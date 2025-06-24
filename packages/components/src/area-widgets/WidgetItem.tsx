'use client'

import React, { forwardRef, memo, ReactNode, useEffect, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react/macro'
import { AnimatePresence, motion } from 'motion/react'
import { isMobileApp, WidgetType } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { structIdAtom } from '@penx/hooks/useStructId'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { PanelType, Widget } from '@penx/types'
import { ContextMenu, ContextMenuTrigger } from '@penx/uikit/context-menu'
import { DialogDescription, DialogTitle } from '@penx/uikit/dialog'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { WidgetIcon } from '@penx/widgets/WidgetIcon'
import { WidgetName } from '@penx/widgets/WidgetName'
import { AddChatButton } from './AddChatButton'
import { AddCreationButton } from './AddCreationButton'
import { AllCreationCard } from './AllCreationCard'
import { IsAllProvider } from './IsAllContext'
import { TitleContextMenu } from './TitleContextMenu'
import { ToggleButton } from './ToggleButton'
import { WidgetRender } from './WidgetRender'
import { StructList } from './widgets/StructList'

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

    const { structs } = useStructs()
    const { area } = useArea()
    const [visible, setVisible] = useState(false)
    const [struct, setStruct] = useState(null as any)
    const { close } = useMobileMenu()

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

    const titleJSX = (
      <div
        className={cn(
          'relative flex h-10 cursor-pointer select-none items-center justify-between pr-2',
          isMobileApp && 'h-10',
        )}
      >
        <div
          className={cn(
            'flex h-full flex-1 items-center gap-1 pl-3',
            isMobileApp && 'pl-0',
          )}
          {...attributes}
          {...listeners}
          onClick={(e) => {
            if (widget.type === WidgetType.JOURNAL) {
              store.panels.openJournal(new Date())
              close()
              return
            }

            if (widget.type === WidgetType.ALL_STRUCTS) {
              store.panels.openAllStructs()
              close()
              return
            }

            if (isMobileApp) {
              appEmitter.emit('ROUTE_TO_WIDGET', widget)
              close()
              return
            }

            if (widget.type === WidgetType.AI_CHAT) {
              store.panels.openWidgetPanel(widget)
              return
            }

            if (widget.type === WidgetType.STRUCT) {
              const struct = structs.find((s) => s.id === widget.structId)
              if (struct?.isTask) return
            }

            setVisible(!visible)
          }}
        >
          {/* <WidgetIcon type={widget.type} structs={structs} /> */}
          <div className="text-foreground select-none text-base font-semibold">
            <WidgetName widget={widget} structs={structs} />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5',
            !isMobileApp && 'opacity-0 group-hover/widget:opacity-100',
          )}
        >
          {widget.type === WidgetType.STRUCT && !isMobileApp && (
            <AddCreationButton area={area} widget={widget} />
          )}

          {widget.type === WidgetType.AI_CHAT && (
            <AddChatButton widget={widget} />
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
            !isMobileApp &&
              'shadow-2xs dark:bg-foreground/8 rounded-md bg-white',
          )}
          {...rest}
        >
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
          {(!isMobileApp || widget.type === WidgetType.ALL_STRUCTS) && (
            <AnimatePresence initial={false}>
              {!widget.collapsed ? (
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                >
                  <IsAllProvider>
                    {widget.type === WidgetType.ALL_STRUCTS ? (
                      <StructList
                        onSelect={(struct) => {
                          if (isMobileApp) {
                            close()
                            appEmitter.emit('ROUTE_TO_STRUCT')
                            store.panels.openStruct(struct.id)
                            store.set(structIdAtom, struct.id)
                          } else {
                            // setVisible(!visible)
                            store.panels.openStruct(struct.id)
                          }
                          setStruct(struct)
                        }}
                      />
                    ) : (
                      <WidgetRender widget={widget} />
                    )}
                  </IsAllProvider>
                </motion.div>
              ) : null}
            </AnimatePresence>
          )}
        </div>

        {!isMobileApp && (
          <AllCreationCard
            name={<WidgetName widget={widget} structs={structs} />}
            visible={visible}
            setVisible={setVisible}
            widget={widget}
            struct={struct}
          />
        )}
      </>
    )
  },
)
