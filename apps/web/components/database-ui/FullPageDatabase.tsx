'use client'

import { DATABASE_TOOLBAR_HEIGHT, WORKBENCH_NAV_HEIGHT } from '@penx/constants'
import { RouterOutputs } from '@penx/api'
import { Separator } from '@penx/uikit/ui/separator'
import { DatabaseProvider } from './DatabaseProvider'
import { TableName } from './TableName'
import { AddViewBtn } from './ViewNav/AddViewBtn'
import { ViewList } from './ViewNav/ViewList'
import { ViewRenderer } from './ViewRenderer'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

type Database = RouterOutputs['database']['byId']
interface Props {
  id?: string
  slug?: string
  fetcher?: () => Promise<Database>
}

export const FullPageDatabase = (props: Props) => {
  return (
    <DatabaseProvider {...props}>
      <div className="flex flex-col">
        <div
          className="flex w-full items-center justify-between gap-8"
          style={{ height: DATABASE_TOOLBAR_HEIGHT }}
        >
          <div className="flex items-center gap-2">
            <TableName />
            <ViewList />
            <AddViewBtn />
          </div>
          <div className="hidden md:block">
            {/* <Separator orientation="vertical" className="h-5" /> */}
            <ViewToolBar />
          </div>
        </div>

        <ViewRenderer />
      </div>
    </DatabaseProvider>
  )
}
