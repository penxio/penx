'use client'

import { useState } from 'react'
import { useLayer } from 'react-laag'
import { Rectangle } from '@glideapps/glide-data-grid'
import { IColumn } from '@penx/model-type'
import { ColumnMenu } from '../ColumnMenu/ColumnMenu'
import { useFieldTypeSelectPopover } from './useFieldTypeSelectPopover'

export const useColumnMenu = (columns: IColumn[]) => {
  const [menu, setMenu] = useState<{
    col: number
    bounds: Rectangle
  }>()

  const fieldTypeSelectPopover = useFieldTypeSelectPopover()
  const isOpen = menu !== undefined
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: 'bottom-end',
    triggerOffset: 2,
    onOutsideClick: () => {
      if (!fieldTypeSelectPopover.isOpen) {
        setMenu(undefined)
      }
    },
    trigger: {
      getBounds: () => ({
        left: menu?.bounds.x ?? 0,
        top: menu?.bounds.y ?? 0,
        width: menu?.bounds.width ?? 0,
        height: menu?.bounds.height ?? 0,
        right: (menu?.bounds.x ?? 0) + (menu?.bounds.width ?? 0),
        bottom: (menu?.bounds.y ?? 0) + (menu?.bounds.height ?? 0),
      }),
    },
  })

  const columnMenuUI = (
    <>
      {isOpen &&
        renderLayer(
          <div
            {...layerProps}
            className="bg-popover shadow-popover z-[10000] w-[260px] overflow-hidden rounded-lg"
          >
            <ColumnMenu
              index={menu.col}
              column={columns[menu.col]}
              close={() => setMenu(undefined)}
            />
          </div>,
        )}
    </>
  )

  return {
    setColumnMenu: setMenu,
    columnMenuUI,
  }
}
