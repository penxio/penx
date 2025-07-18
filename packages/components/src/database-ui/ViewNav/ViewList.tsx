'use client'

import { cn, mappedByKey } from '@penx/utils'
import { useDatabaseContext } from '../../DatabaseProvider'
import { ViewItem } from './ViewItem'

export const ViewList = () => {
  const { struct, activeViewId, setActiveViewId } = useDatabaseContext()

  const { views } = struct
  const { viewIds = [] } = struct

  if (!struct) return null

  const viewMap = mappedByKey(views, 'id')
  const sortedViews = viewIds.map((viewId) => viewMap[viewId])

  return (
    <div className="flex items-center gap-1">
      {sortedViews.map((view, index) => {
        if (!view) return null
        return <ViewItem key={view.id} view={view} index={index} />
      })}
    </div>
  )
}
