'use client'

import { mappedByKey } from '@/lib/shared'
import { ViewType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useDatabaseContext } from '../DatabaseProvider'
import { ViewIcon } from './ViewIcon'
import { ViewMenu } from './ViewMenu'

export const ViewList = () => {
  const { database, activeViewId, setActiveViewId } = useDatabaseContext()

  const { views } = database
  const { viewIds = [] } = database

  if (!database) return null

  const viewMap = mappedByKey(views, 'id')
  const sortedViews = viewIds.map((viewId) => viewMap[viewId])

  return (
    <div className="flex items-center gap-1">
      {sortedViews.map((view, index) => {
        if (!view) return null
        const active = activeViewId === view.id
        return (
          <div
            key={view.id}
            className={cn(
              'text-foreground/60 hover:bg-foreground/5 flex h-7 cursor-pointer items-center justify-center gap-1 rounded px-3',
              active && 'text-foreground/90 bg-foreground/5',
            )}
            onClick={async () => {
              setActiveViewId(view.id)
            }}
          >
            <ViewIcon viewType={view.viewType as any} />
            <div className="shrink-0">{view.name}</div>
          </div>
        )
      })}
    </div>
  )
}
