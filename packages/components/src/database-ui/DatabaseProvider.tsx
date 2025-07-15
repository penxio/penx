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
import { arrayMoveImmutable } from 'array-move'
import { produce } from 'immer'
import { Creation, Struct } from '@penx/domain'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { useCreations } from '@penx/hooks/useCreations'
import { getRandomColorName } from '@penx/libs/color-helper'
import { localDB } from '@penx/local-db'
import { IColumn, IStructNode, IView } from '@penx/model-type'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import {
  ColumnType,
  Filter,
  Group,
  Option,
  Sort,
  ViewColumn,
  ViewType,
} from '@penx/types'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { uniqueId } from '@penx/unique-id'

type UpdateDatabaseInput = Partial<IStructNode['props']>

type UpdateViewColumnInput = Partial<ViewColumn>

export interface IDatabaseContext {
  theme?: string
  struct: Struct
  records: Creation[]
  columns: IColumn[]
  currentView: IView
  // filterResult: any
  // updateRowsIndexes: () => void
  activeViewId: string
  setActiveViewId: (viewId: string) => void
  sortedColumns: IColumn[]

  updateDatabase: (props: UpdateDatabaseInput) => void

  addView(viewType: ViewType): any
  updateView(viewId: string, data: Partial<IView>): Promise<void>
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
  updateColumn(columnId: string, input: Partial<IColumn>): Promise<void>
  updateColumnWidth(columnId: string, width: number): Promise<void>
  addOption(
    columnId: string,
    name: string,
  ): Promise<{
    newOption: Option
    newColumns: IColumn[]
  }>
  deleteCellOption(cellId: string, optionId: string): Promise<void>
}

export const DatabaseContext = createContext({} as IDatabaseContext)

interface DatabaseProviderProps {
  struct: Struct
  theme?: string
}
export function DatabaseProvider({
  theme,
  struct,
  children,
}: PropsWithChildren<DatabaseProviderProps>) {
  const { creations, raw: creationNodes, creationsByStruct } = useCreations()
  const records = creationsByStruct(struct.id)
  const addCreation = useAddCreation()

  const activeViewId = struct.activeViewId

  async function setActiveViewId(viewId: string) {
    const newStruct = produce(struct.raw, (draft) => {
      draft.props.activeViewId = viewId
    })

    store.structs.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      activeViewId: viewId,
    })
  }

  async function updateDatabase(props: UpdateDatabaseInput) {
    store.structs.updateStructProps(struct, props)
  }

  async function addView(viewType: ViewType) {
    const viewColumns: ViewColumn[] = struct.columns.map((column) => ({
      columnId: column.id,
      width: 160,
      visible: true,
    }))

    const newView: IView = {
      id: uniqueId(),
      name: viewType.toLowerCase(),
      description: '',
      viewType: viewType,
      viewColumns: viewColumns,
      sorts: [],
      groups: [],
      filters: [],
      kanbanColumnId: '',
      kanbanOptionIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const newStruct = produce(struct.raw, (draft) => {
      draft.props.views.push(newView)
      draft.props.activeViewId = newView.id
      draft.props.viewIds.push(newView.id)
    })

    store.structs.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      activeViewId: newView.id,
      viewIds: newStruct.props.viewIds,
      views: newStruct.props.views,
    })
  }

  async function updateView(viewId: string, data: Partial<IView>) {
    const newStruct = produce(struct.raw, (draft) => {
      const index = draft.props.views.findIndex((v) => v.id === viewId)
      draft.props.views[index] = { ...draft.props.views[index], ...data }
    })

    store.structs.updateStruct(struct.id, newStruct)
    await localDB.updateStructProps(struct.id, {
      views: newStruct.props.views,
    })
  }

  async function deleteView(viewId: string) {
    if (struct.views.length === 1) return
    const newStruct = produce(struct.raw, (draft) => {
      draft.props.views = draft.props.views.filter((v) => v.id !== viewId)
    })

    store.structs.updateStruct(struct.id, newStruct)
    await localDB.updateStructProps(struct.id, {
      activeViewId: newStruct.props.views[0].id,
      views: newStruct.props.views,
    })
  }

  async function updateViewColumn(
    columnId: string,
    props: UpdateViewColumnInput,
  ) {
    const newStruct = produce(struct.raw, (draft) => {
      for (const view of draft.props.views) {
        if (view.id === activeViewId) {
          const index = view.viewColumns.findIndex(
            (i) => i.columnId === columnId,
          )
          view.viewColumns[index] = { ...view.viewColumns[index], ...props }
          break
        }
      }
    })

    store.structs.updateStruct(struct.id, newStruct)
    await localDB.updateStructProps(struct.id, {
      views: newStruct.props.views,
    })
  }

  async function addRecord() {
    addCreation({
      type: struct.type,
      isAddPanel: false,
    })
  }

  async function deleteRecord(recordId: string) {
    // const newDatabase = produce(database, (draft) => {
    //   draft.records = draft.records.filter(
    //     (record) => record.id !== recordId,
    //   ) as DatabaseRecord[]
    // })
    // reloadDatabase(newDatabase)
  }

  async function addColumn(columnType: ColumnType) {
    store.structs.addColumn(struct, { columnType })
  }

  async function deleteColumn(columnId: string) {
    store.structs.deleteColumn(struct, columnId)
  }

  async function sortColumn(fromIndex: number, toIndex: number) {
    const newStruct = produce(struct.raw, (draft) => {
      for (const view of draft.props.views) {
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

    store.structs.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      views: newStruct.props.views,
    })
  }

  async function updateColumnName(columnId: string, name: string) {
    store.structs.updateColumnName(struct, columnId, name)
  }

  async function updateColumnWidth(columnId: string, width: number) {
    const newStruct = produce(struct.raw, (draft) => {
      for (const view of draft.props.views) {
        if (view.id === activeViewId) {
          const index = view.viewColumns.findIndex(
            (i) => i.columnId === columnId,
          )
          view.viewColumns[index].width = width
          break
        }
      }
    })

    store.structs.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      views: newStruct.props.views,
    })
  }

  async function updateColumn(columnId: string, data: Partial<IColumn>) {
    store.structs.updateColumn(struct, columnId, data)
  }

  async function addOption(columnId: string, name: string) {
    return store.structs.addOption(struct, columnId, { name })
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

  const updateRowsIndexes = useCallback(() => {}, [])

  const sortedColumns = useMemo(() => {
    if (!struct.currentView) return []
    return struct.currentView.viewColumns
      .filter((v) => v.visible)
      .map(({ columnId }) => {
        return struct.columns.find((col) => col.id === columnId)!
      })
  }, [struct])

  const generateFilter = (databaseId: string) => {
    //
    return {} as any
  }

  return (
    <DatabaseContext.Provider
      value={{
        theme,
        struct,
        // filterResult: generateFilter(databaseId),
        // updateRowsIndexes,
        records,
        columns: struct.columns,
        currentView: struct.currentView,
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
