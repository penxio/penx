'use client'

import { RouterOutputs } from '@penx/api'
import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { Struct } from '@penx/domain'
import { Separator } from '@penx/uikit/separator'
import { DatabaseProvider } from './DatabaseProvider'
import { TableInfo } from './TableInfo'
import { AddViewBtn } from './ViewNav/AddViewBtn'
import { ViewList } from './ViewNav/ViewList'
import { ViewRenderer } from './ViewRenderer'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  struct: Struct
}

export const FullPageDatabase = (props: Props) => {
  return (
    <DatabaseProvider {...props}>
      <div className="flex flex-col px-3">
        <div
          className="flex w-full items-center justify-between gap-8"
          style={{ height: DATABASE_TOOLBAR_HEIGHT }}
        >
          <div className="flex items-center gap-2">
            <TableInfo />
            <ViewList />
            <AddViewBtn />
          </div>
          <div className="hidden md:block">
            <ViewToolBar />
          </div>
        </div>
        <ViewRenderer />
      </div>
    </DatabaseProvider>
  )
}
