'use client'

import { useState } from 'react'
import { useLayer } from 'react-laag'
import { IRowNode } from '@penx/model'
import { Item, Rectangle } from '@glideapps/glide-data-grid'
import { Record } from '@prisma/client'
import { CellMenu } from '../CellMenu'

export const useCellMenu = () => {
  const [menu, setMenu] = useState<{
    row: Record
    bounds: Rectangle
  }>()

  const isOpen = menu !== undefined
  const { layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: 'bottom-end',
    triggerOffset: 2,
    onOutsideClick: () => setMenu(undefined),
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

  const cellMenuUI = (
    <>
      {isOpen &&
        renderLayer(
          <div
            {...layerProps}
            className="bg-popover overflow-hidden rounded-lg border shadow-md"
          >
            <CellMenu row={menu.row} close={() => setMenu(undefined)} />
          </div>,
        )}
    </>
  )

  return {
    setCellMenu: setMenu,
    cellMenuUI,
  }
}
