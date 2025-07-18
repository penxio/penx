'use client'

import { useDatabaseContext } from '../../DatabaseProvider'
import { FilterField } from './FilterField'
import { GroupField } from './GroupField'
import { HideField } from './HideField/HideField'
import { SortField } from './SortField'
import { TableField } from './TableField'

export const ViewToolBar = () => {
  const { currentView } = useDatabaseContext()

  return (
    <div className="flex items-center gap-1">
      {/* <HideField /> */}
      {/* <FilterField /> */}
      {/* <SortField /> */}
      {/* <GroupField /> */}
      {/* {currentView.props.viewType === ViewType.TABLE && <TableField />} */}
    </div>
  )
}
