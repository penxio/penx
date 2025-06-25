'use client'

import {
  DATABASE_TOOLBAR_HEIGHT,
  isMobileApp,
  WORKBENCH_NAV_HEIGHT,
} from '@penx/constants'
import { Struct } from '@penx/domain'
import { DatabaseProvider } from './DatabaseProvider'
import { TableInfo } from './TableInfo'
import { AddViewBtn } from './ViewNav/AddViewBtn'
import { ViewList } from './ViewNav/ViewList'
import { ViewRenderer } from './ViewRenderer'
import { ViewToolBar } from './ViewToolBar/ViewToolBar'

interface Props {
  struct: Struct
  theme?: string
}

export const FullPageDatabase = (props: Props) => {
  return (
    <DatabaseProvider {...props}>
      <div className="flex h-full flex-1 flex-col">
        <div
          className="flex w-full items-center justify-between gap-8  px-3 shrink-0"
          style={{ height: DATABASE_TOOLBAR_HEIGHT }}
        >
          <div className="flex items-center gap-2">
            {!isMobileApp && <TableInfo struct={props.struct} />}
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
