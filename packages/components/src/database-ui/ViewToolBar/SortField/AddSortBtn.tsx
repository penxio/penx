'use client'

import { Menu, MenuItem } from '@ariakit/react'
import { Plus } from 'lucide-react'
import { IColumn } from '@penx/model-type'
import { Sort } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { useDatabaseContext } from '../../DatabaseProvider'
import { FieldIcon } from '../../shared/FieldIcon'

export const AddSortBtn = () => {
  const { currentView, addSort } = useDatabaseContext()
  const columns: IColumn[] = []

  let { viewColumns = [] } = currentView

  const sortedColumns = viewColumns.map(
    (o) => columns.find((c) => c.id === o.columnId)!,
  )

  async function selectColumn(column: IColumn) {
    await addSort(currentView.id, column.id, {
      isAscending: true,
    })
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm">
          <Plus size={16} />
          <div>Add sort</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Menu className="bg-background w-[180px] rounded p-2">
          {sortedColumns
            .filter((i) => {
              const sorts = currentView.sorts as any as Sort[]
              const find = sorts.find((item) => item.columnId === i.id)
              return !find
            })
            .map((column) => {
              return null
              // return (
              //   <MenuItem
              //     key={column.id}
              //     onClick={() => {
              //       // close()
              //       selectColumn(column)
              //     }}
              //   >
              //     <FieldIcon size={18} columnType={column.props.columnType} />
              //     <div>{column.props.displayName}</div>
              //   </MenuItem>
              // )
            })}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
