'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import { mappedByKey } from '@/lib/shared'
import { Filter } from '@penx/types'
import { Menu, MenuItem } from '@ariakit/react'
import { Column } from '@prisma/client'
import { Check, ChevronDown } from 'lucide-react'
import { FieldIcon } from '../../shared/FieldIcon'

interface FieldSelectProps {
  filter: Filter
  columns: Column[]
  sortedColumns: Column[]
  updateFilter: (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => void
}
export function FieldSelect({
  sortedColumns,
  filter,
  columns,
  updateFilter,
}: FieldSelectProps) {
  const column = mappedByKey(columns)[filter.columnId]

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex h-8 w-32 items-center justify-between rounded-lg border px-2 text-sm">
          <div className="flex items-center gap-1">
            <FieldIcon columnType={column.columnType as any} />
            <div className="text-sm">{column.displayName}</div>
          </div>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[180px]">
        <Menu>
          {!sortedColumns.length && (
            <div
              className="text-foreground/40 flex items-center px-2 py-4 text-sm"
              // onClick={close}
            >
              No filters
            </div>
          )}
          {sortedColumns.map((item) => (
            <MenuItem
              key={item.id}
              onClick={() => {
                // updateFilter(filter.columnId, item.id)
                // close()
              }}
            >
              <div className="flex items-center gap-2">
                <FieldIcon columnType={item.columnType} />
                <div>{item.displayName}</div>
              </div>
              {/* {item.id === filter.columnId && <Check size={18}></Check>} */}
            </MenuItem>
          ))}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
