'use client'

import { Button } from '@penx/uikit/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/popover'
import { IColumnNode } from '@penx/model-type'
import { Group } from '@penx/types'
import { Menu, MenuItem } from '@ariakit/react'
import { Plus } from 'lucide-react'
import { useDatabaseContext } from '../../DatabaseProvider'
import { FieldIcon } from '../../shared/FieldIcon'

export const AddGroupBtn = () => {
  const { currentView, addGroup } = useDatabaseContext()
  const columns: any[] = []

  let { viewColumns = [] } = currentView

  const sortedColumns = viewColumns.map(
    (o) => columns.find((c) => c.id === o.columnId)!,
  )

  async function selectColumn(column: IColumnNode) {
    await addGroup(currentView.id, column.id, {
      isAscending: true,
    })
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm">
          <Plus size={16} />
          <div>Add group</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Menu>
          {sortedColumns
            .filter((i) => {
              const groups = currentView.groups as any as Group[]
              const find = groups.find((item) => item.columnId === i.id)
              return !find
            })
            .map((column) => {
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => {
                    // close()
                    selectColumn(column)
                  }}
                >
                  <FieldIcon size={18} columnType={column.props.columnType} />
                  <div>{column.props.displayName}</div>
                </MenuItem>
              )
            })}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
