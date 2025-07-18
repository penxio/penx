'use client'

import { SortAsc } from 'lucide-react'
import { Sort } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Separator } from '@penx/uikit/separator'
import { useDatabaseContext } from '../../../DatabaseProvider'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddSortBtn } from './AddSortBtn'
import { SortItem } from './SortItem'

export const SortField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  const sorts = currentView.sorts as any as Sort[]

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarBtn isHighlight={!!sorts.length} icon={<SortAsc size={16} />}>
          <div className="flex items-center gap-1">
            {!!sorts.length && <div> {sorts.length} sorted fields</div>}
            {!sorts.length && <div>Sort</div>}
          </div>
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent>
        {!sorts.length && (
          <div className="text-foreground/40 p-3 text-sm">
            No sorts applied to this view
          </div>
        )}

        {!!sorts.length && (
          <div className="flex flex-col gap-1 p-3">
            {sorts.map((sort) => (
              <SortItem key={sort.columnId} sort={sort} />
            ))}
          </div>
        )}

        <Separator />
        <div className="flex items-center justify-between p-3">
          <div className="text-foreground/40 text-sm">Coming soon</div>
          <AddSortBtn />
        </div>
      </PopoverContent>
    </Popover>
  )
}
