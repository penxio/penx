'use client'

import { Plus } from 'lucide-react'
import { Filter } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { useDatabaseContext } from '../../DatabaseProvider'

interface IFilterBtns {
  filters: Filter[]
  viewColumns: any[]
  currentView: any
  addFilter: () => void
}

export const FilterBtns = ({
  addFilter,
  currentView,
  filters,
}: IFilterBtns) => {
  const { applyFilter } = useDatabaseContext()

  async function onApplyFilter() {
    // await applyFilter(currentView.id, filters)
    // close()
  }

  return (
    <>
      <Button size="sm" onClick={addFilter}>
        <Plus size={16} />
        <div>Add filter</div>
      </Button>
      <div className="text-foreground/40 text-sm">
        <Button size="sm" onClick={onApplyFilter}>
          Apply filter
        </Button>
      </div>
    </>
  )
}
