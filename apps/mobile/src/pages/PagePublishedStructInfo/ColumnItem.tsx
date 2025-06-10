import React, { forwardRef, ReactNode } from 'react'
import { Dialog } from '@capacitor/dialog'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { t } from '@lingui/core/macro'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { FieldIcon } from '@penx/components/FieldIcon'
import { Struct } from '@penx/domain'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useEditPropertyDrawer } from './EditPropertyDrawer/useEditPropertyDrawer'

interface Props {
  column: IColumn
}

export const ColumnItem = forwardRef<HTMLDivElement, Props>(function Item(
  props: Props,
  ref,
) {
  const { column } = props

  return (
    <div ref={ref} className={cn('relative flex flex-col')}>
      <div
        className={cn(
          'relative flex h-11 cursor-pointer select-none items-center justify-between pr-0',
        )}
      >
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-1">
            <FieldIcon columnType={column.columnType} />
            <ColumnTypeName
              className="w-28 text-sm"
              columnType={column.columnType}
            />
          </div>
          <div>{column.name}</div>
        </div>
      </div>
    </div>
  )
})
