'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@penx/uikit/ui/popover'
import { Filter, OperatorType } from '@/lib/types'
import { Menu, MenuItem } from '@ariakit/react'
import { ChevronDown } from 'lucide-react'

interface FieldSelectProps {
  filter: Filter
  updateFilter: (
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) => void
}

export function OperatorSelect({ filter, updateFilter }: FieldSelectProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex h-8 w-32 items-center justify-between rounded-lg border px-2 text-sm">
          <div>{filter.operator}</div>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Menu w-120>
          {Object.keys(OperatorType).map((type) => (
            <MenuItem
              key={type}
              // selected={type === filter.operator}
              onClick={() => {
                // updateFilter(filter.columnId, filter.columnId, {
                //   operator: type as OperatorType,
                // })
                // close()
              }}
            >
              <div>{type}</div>
            </MenuItem>
          ))}
        </Menu>
      </PopoverContent>
    </Popover>
  )
}
