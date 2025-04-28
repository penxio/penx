'use client'

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSession } from '@penx/session'
import { useQueryDatabase } from '@penx/hooks/useQueryDatabase'
import { getRandomColorName } from '@penx/libs/color-helper'
import { FRIEND_DATABASE_NAME, PROJECT_DATABASE_NAME } from '@penx/constants'
import { IFilterResult, IOptionNode } from '@penx/model'
import { queryClient } from '@penx/query-client'
import { api } from '@penx/trpc-client'
import {
  ColumnType,
  Filter,
  Group,
  Option,
  Sort,
  ViewColumn,
  ViewType,
} from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { RouterInputs, RouterOutputs } from '@penx/api'
import { Column, Record as Row, View } from '@penx/db/client'
import { arrayMoveImmutable } from 'array-move'
import { produce } from 'immer'
import { useSearchParams } from 'next/navigation'
import { useSiteContext } from '@penx/contexts/SiteContext'

type DatabaseView = Omit<View, 'viewColumns'> & {
  viewColumns: ViewColumn[]
}

type DatabaseRecord = Omit<Row, 'columns'> & {
  columns: Record<string, any>
}

export type Database = Omit<RouterOutputs['database']['byId'], 'view'> & {
  viewIds: string[]
  views: DatabaseView[]
  records: DatabaseRecord[]
}

type UpdateDatabaseInput = Omit<
  RouterInputs['database']['updateDatabase'],
  'databaseId'
>

type UpdateViewColumnInput = Omit<
  RouterInputs['database']['updateViewColumn'],
  'viewId' | 'columnId'
>

type UpdateColumnInput = {
  name?: string
  displayName?: string
  columnType?: string
}

export interface IDatabaseContext {
  database: Database
  currentView: DatabaseView

  filterResult: any
  updateRowsIndexes: () => void

  activeViewId: string
  setActiveViewId: (viewId: string) => void
  sortedColumns: Column[]

  updateDatabase: (props: UpdateDatabaseInput) => void

  addView(viewType: ViewType): any
  updateView(viewId: string, props: any): Promise<void>
  deleteView(viewId: string): Promise<void>

  updateViewColumn(columnId: string, props: any): Promise<void>

  addRecord(): Promise<void>
  deleteRecord(rowId: string): Promise<void>

  addColumn(columnType: ColumnType): Promise<void>
  deleteColumn(columnId: string): Promise<void>
  sortColumns(fromIndex: number, toIndex: number): Promise<void>

  addSort(viewId: string, columnId: string, props: Partial<Sort>): Promise<void>
  deleteSort(viewId: string, columnId: string): Promise<void>

  addGroup(
    viewId: string,
    columnId: string,
    props: Partial<Group>,
  ): Promise<void>
  deleteGroup(viewId: string, columnId: string): Promise<void>

  addFilter(
    viewId: string,
    columnId: string,
    props: Partial<Filter>,
  ): Promise<void>
  deleteFilter(viewId: string, columnId: string): Promise<void>
  applyFilter(viewId: string, filters: Filter[]): Promise<void>

  updateFilter(
    viewId: string,
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ): Promise<void>

  updateColumnName(columnId: string, name: string): Promise<void>
  updateColumn(columnId: string, input: UpdateColumnInput): Promise<void>
  updateColumnWidth(columnId: string, width: number): Promise<void>
  addOption(columnId: string, name: string): Promise<Option>
  deleteCellOption(cellId: string, optionId: string): Promise<void>
}

export const DatabaseContext = createContext({} as IDatabaseContext)

interface DatabaseProviderProps {
  id?: string
  slug?: string
  fetcher?: () => Promise<RouterOutputs['database']['byId']>
}
export function DatabaseProvider({
  id,
  slug,
  fetcher,
  children,
}: PropsWithChildren<DatabaseProviderProps>) {
  const params = useSearchParams()
  const databaseId = id || params?.get('id')!
  const { isLoading, data } = useQueryDatabase({
    id: databaseId,
    slug,
    fetcher,
  })

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <DatabaseContent database={data as any as Database}>
      {children}
    </DatabaseContent>
  )
}

interface DatabaseContentProps {
  database: Database
}

function DatabaseContent({
  database,
  children,
}: PropsWithChildren<DatabaseContentProps>) {
  const params = useSearchParams()
  const databaseId = params?.get('id')!
  const site = useSiteContext()
  const { data } = useSession()
  const userId = data?.userId || ''

  function reloadDatabase(newDatabase: Database) {
    queryClient.setQueriesData(
      {
        queryKey: [
          'database',
          [PROJECT_DATABASE_NAME, FRIEND_DATABASE_NAME].includes(database.slug)
            ? database.slug
            : databaseId,
        ],
      },
      newDatabase,
    )
  }

  async function updateDatabase(props: UpdateDatabaseInput) {
    const newDatabase = produce(database, (draft) => {
      if (props.name) draft.name = props.name
      if (props.color) draft.color = props.color
    })

    reloadDatabase(newDatabase)
    await api.database.updateDatabase.mutate({
      ...props,
      databaseId: database.id,
    })
  }

  async function addView(viewType: ViewType) {
    //
  }

  async function updateView(viewId: string, props: any) {}

  async function deleteView(viewId: string) {}

  async function updateViewColumn(
    columnId: string,
    props: UpdateViewColumnInput,
  ) {
    const newDatabase = produce(database, (draft) => {
      for (const view of draft.views) {
        if (view.id === activeViewId) {
          const index = view.viewColumns.findIndex(
            (i) => i.columnId === columnId,
          )
          if (typeof props.width === 'number') {
            view.viewColumns[index].width = props.width
          }
          if (typeof props.visible === 'boolean') {
            view.viewColumns[index].visible = props.visible
          }
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateViewColumn.mutate({
      viewId: currentView.id,
      columnId,
      ...props,
    })
  }

  async function addRecord() {
    const newColumns = database.columns.reduce(
      (acc, column) => {
        return {
          ...acc,
          [column.id]: '',
        }
      },
      {} as Record<string, any>,
    )

    const id = uniqueId()
    const newDatabase = produce(database, (draft) => {
      draft.records.push({
        id,
        databaseId: database.id,
        sort: database.records.length,
        columns: newColumns,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DatabaseRecord)
    })

    reloadDatabase(newDatabase)

    await api.database.addRecord.mutate({
      id,
      siteId: site.id,
      databaseId: database.id,
      columns: newColumns,
    })
  }

  async function deleteRecord(recordId: string) {
    const newDatabase = produce(database, (draft) => {
      draft.records = draft.records.filter(
        (record) => record.id !== recordId,
      ) as DatabaseRecord[]
    })

    reloadDatabase(newDatabase)
    await api.database.deleteRecord.mutate({
      databaseId: database.id,
      recordId,
    })
  }

  async function addColumn(columnType: ColumnType) {
    const nameMap: Record<string, string> = {
      [ColumnType.TEXT]: 'Text',
      [ColumnType.NUMBER]: 'Number',
      [ColumnType.URL]: 'URL',
      [ColumnType.PASSWORD]: 'Password',
      [ColumnType.SINGLE_SELECT]: 'Single Select',
      [ColumnType.MULTIPLE_SELECT]: 'Multiple Select',
      [ColumnType.RATE]: 'Rate',
      [ColumnType.IMAGE]: 'Image',
      [ColumnType.MARKDOWN]: 'Markdown',
      [ColumnType.DATE]: 'Date',
      [ColumnType.CREATED_AT]: 'Created At',
      [ColumnType.UPDATED_AT]: 'Updated At',
    }

    const id = uniqueId()
    const name = uniqueId()
    const displayName = nameMap[columnType] || ''

    const newDatabase = produce(database, (draft) => {
      draft.columns.push({
        siteId: site.id,
        userId: site.userId,
        id,
        isPrimary: false,
        databaseId: database.id,
        name,
        displayName,
        description: '',
        config: {},
        options: [],
        columnType,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      for (const view of draft.views) {
        view.viewColumns.push({
          columnId: id,
          width: 160,
          visible: true,
        })
      }

      for (const record of draft.records) {
        record.columns[id] = ''
      }
    })

    reloadDatabase(newDatabase)
    await api.database.addColumn.mutate({
      siteId: site.id,
      id,
      columnType,
      databaseId: database.id,
      name,
      displayName,
    })
  }

  async function deleteColumn(columnId: string) {
    const newDatabase = produce(database, (draft) => {
      draft.columns = draft.columns.filter((column) => column.id !== columnId)

      for (const view of draft.views) {
        const viewColumns = view.viewColumns as ViewColumn[]
        view.viewColumns = viewColumns.filter(
          (i) => i.columnId !== columnId,
        ) as any
      }

      for (const record of draft.records) {
        delete record.columns[columnId]
      }
    })
    reloadDatabase(newDatabase)
    await api.database.deleteColumn.mutate({
      databaseId: database.id,
      columnId,
    })
  }

  async function sortColumn(fromIndex: number, toIndex: number) {
    const newDatabase = produce(database, (draft) => {
      for (const view of draft.views) {
        if (view.id === activeViewId) {
          view.viewColumns = arrayMoveImmutable(
            view.viewColumns,
            fromIndex,
            toIndex,
          )
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.sortViewColumns.mutate({
      viewId: activeViewId,
      fromIndex,
      toIndex,
    })
  }

  async function updateColumnName(columnId: string, name: string) {
    const newDatabase = produce(database, (draft) => {
      for (const field of draft.columns) {
        if (field.id === columnId) {
          field.displayName = name
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateColumn.mutate({
      columnId,
      displayName: name,
    })
  }

  async function updateColumn(columnId: string, data: UpdateColumnInput) {
    const newDatabase = produce(database, (draft) => {
      for (const field of draft.columns) {
        if (field.id === columnId) {
          if (data.displayName) field.displayName = data.displayName
          if (data.name) field.name = data.name
          if (data.columnType) field.columnType = data.columnType
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateColumn.mutate({
      columnId,
      ...data,
    })
  }

  async function updateColumnWidth(columnId: string, width: number) {
    const newDatabase = produce(database, (draft) => {
      for (const view of draft.views) {
        if (view.id === activeViewId) {
          const index = view.viewColumns.findIndex(
            (i) => i.columnId === columnId,
          )
          view.viewColumns[index].width = width
          break
        }
      }
    })

    reloadDatabase(newDatabase)

    await api.database.updateViewColumn.mutate({
      viewId: currentView.id,
      columnId,
      width,
    })
  }

  async function addOption(columnId: string, name: string) {
    const id = uniqueId()
    const newOption = {
      id,
      columnId,
      name,
      color: getRandomColorName(),
    }
    const newDatabase = produce(database, (draft) => {
      for (const field of draft.columns) {
        if (field.id === columnId) {
          const options = (field.options as any as Option[]) || []
          field.options = [...options, newOption] as any[]
          break
        }
      }
    })

    reloadDatabase(newDatabase)
    api.database.addOption.mutate(newOption)
    return newOption
  }

  async function deleteCellOption(cellId: string, optionId: string) {}

  async function addSort(
    viewId: string,
    columnId: string,
    props: Partial<Sort>,
  ) {}

  async function deleteSort(viewId: string, columnId: string) {}

  async function addGroup(
    viewId: string,
    columnId: string,
    props: Partial<Group>,
  ) {}

  async function deleteGroup(viewId: string, columnId: string) {}

  async function addFilter(
    viewId: string,
    columnId: string,
    props: Partial<Filter>,
  ) {}

  async function deleteFilter(viewId: string, columnId: string) {}

  async function applyFilter(viewId: string, filters: Filter[]) {}

  async function updateFilter(
    viewId: string,
    columnId: string,
    newColumnId: string,
    props?: Partial<Filter>,
  ) {}
  // console.log('=======database:', database)

  const [activeViewId, setActiveViewId] = useState(() => {
    const view = database.views.find((v) => v.id === database.activeViewId)
    return view?.id || database?.views[0]?.id
  })

  const currentView = useMemo(() => {
    return database.views.find((view) => view.id === activeViewId)!
  }, [database.views, activeViewId])

  const updateRowsIndexes = useCallback(() => {}, [])

  const sortedColumns = useMemo(() => {
    if (!currentView) return []
    const viewColumns = currentView.viewColumns as any as ViewColumn[]
    return viewColumns.map(({ columnId: columnId }) => {
      return database.columns.find((col) => col.id === columnId)!
    })
  }, [currentView, database])

  const generateFilter = (databaseId: string): IFilterResult => {
    //
    return {} as any
  }

  return (
    <DatabaseContext.Provider
      value={{
        database,
        filterResult: generateFilter(databaseId),
        updateRowsIndexes,
        currentView: currentView as any, // TODO
        sortedColumns,
        activeViewId,
        setActiveViewId,
        updateDatabase,
        addView,
        deleteView,
        updateView,
        updateViewColumn,
        addRecord,
        deleteRecord,
        addColumn,
        deleteColumn: deleteColumn,
        sortColumns: sortColumn,
        updateColumnName,
        updateColumn: updateColumn,
        updateColumnWidth,
        addOption,
        deleteCellOption,
        addSort,
        deleteSort,
        addGroup,
        deleteGroup,
        addFilter,
        deleteFilter,
        applyFilter,
        updateFilter,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabaseContext() {
  return useContext(DatabaseContext)
}
