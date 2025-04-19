'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { DateCell } from '@/components/cells/date-cell'
import { FileCell } from '@/components/cells/file-cell'
import { ImageCell } from '@/components/cells/image-cell'
import {
  PasswordCell,
  passwordCellRenderer,
} from '@/components/cells/password-cell'
import { RateCell } from '@/components/cells/rate-cell'
import { SingleSelectCell } from '@/components/cells/single-select-cell'
import { SystemDateCell } from '@/components/cells/system-date-cell'
import { useDatabaseContext } from '@/components/database-ui/DatabaseProvider'
import { useSiteContext } from '@/components/SiteContext'
import { FRIEND_DATABASE_NAME, PROJECT_DATABASE_NAME } from '@penx/constants'
import { queryClient } from '@penx/query-client'
import { mappedByKey } from '@/lib/shared'
import { api } from '@penx/trpc-client'
import { ColumnType, Option, ViewColumn } from '@/lib/types'
import {
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from '@glideapps/glide-data-grid'
import { Column } from '@penx/db/client'
import { format } from 'date-fns'
import { produce } from 'immer'
import { revalidateTag } from 'next/cache'

function getCols(columns: Column[], viewColumns: ViewColumn[]) {
  const sortedColumns = viewColumns
    .filter((v) => v.visible)
    .map(({ columnId }) => {
      return columns.find((col) => col.id === columnId)!
    })
    .filter((col) => !!col)

  const viewColumnsMapped = mappedByKey(viewColumns, 'columnId')

  const cols: GridColumn[] = sortedColumns.map((column) => {
    function getIcon() {
      if (column.columnType === ColumnType.NUMBER) {
        return GridColumnIcon.HeaderNumber
      }
      return GridColumnIcon.HeaderString
    }

    const viewColumn = viewColumnsMapped[column.id]

    return {
      id: column.id,
      title: column.displayName || '',
      width: viewColumn?.width ?? 160,
      icon: getIcon(),
      hasMenu: true,
      themeOverride: {
        // bgHeader: ''
      },
    }
  })

  return cols
}

export function useTableView() {
  const site = useSiteContext()
  const {
    database,
    filterResult: { filterRows = [], cellNodesMapList = [] },
    currentView,
    deleteColumn,
    sortedColumns,

    // options,
    addRecord,
    updateRowsIndexes,
  } = useDatabaseContext()
  const { columns, records, views } = database
  // console.log('========database:', database)

  const columnsMap = mappedByKey(columns, 'id')
  const rowsMap = mappedByKey(records, 'id')
  let { viewColumns = [] } = currentView
  const [cols, setCols] = useState(getCols(columns, viewColumns))

  const gridRef = useRef<DataEditorRef>(null)

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell
      const column = columnsMap[currentView.viewColumns[col].columnId]
      const record = records[row]
      const columns = record.columns as Record<string, any>

      function getCellData() {
        if (!record) return ''
        let cellData: any = columns?.[column.id]
        if (!cellData) return ''

        if (column.columnType === ColumnType.NUMBER) {
          cellData = cellData?.toString()
        }

        return cellData
      }

      function getKind(): any {
        const maps: Record<any, GridCellKind> = {
          [ColumnType.NUMBER]: GridCellKind.Number,
          [ColumnType.URL]: GridCellKind.Uri,
          [ColumnType.MARKDOWN]: GridCellKind.Markdown,
        }

        return maps[column.columnType!] || GridCellKind.Text
      }

      const cellData = getCellData()

      if (cellData?.refType) {
        return {
          kind: GridCellKind.Text,
          readonly: false,
          allowOverlay: true,
          copyData: '',
          data: '',
          displayData: '',
        }
      }

      if (column.columnType === ColumnType.DATE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellData
            ? format(new Date(cellData), 'yyyy-MM-dd HH:mm:ss')
            : '',
          themeOverride: {
            //
          },
          data: {
            kind: 'date-cell',
            data: cellData,
          },
        } as DateCell
      }

      if (column.columnType === ColumnType.RATE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellData,
          data: {
            kind: 'rate-cell',
            data: cellData,
          },
        } as RateCell
      }

      if (column.columnType === ColumnType.PASSWORD) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellData,
          data: {
            kind: 'password-cell',
            data: cellData,
          },
        } as PasswordCell
      }

      if (column.columnType === ColumnType.FILE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          readonly: true,
          copyData: '',
          data: {
            kind: 'file-cell',
            url: cellData,
            name: '',
          },
        } as FileCell
      }

      if (column.columnType === ColumnType.IMAGE) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          readonly: true,
          copyData: '',
          data: {
            kind: 'image-cell',
            data: cellData,
          },
        } as ImageCell
      }

      if (
        [ColumnType.SINGLE_SELECT, ColumnType.MULTIPLE_SELECT].includes(
          column.columnType as any,
        )
      ) {
        // console.log('=====cellData:', cellData)

        const ids: string[] = Array.isArray(cellData) ? cellData : []
        // console.log('====>>>>>>:ids:', ids, 'cellData:', cellData)

        const options = (column.options as any as Option[]) || []

        const cellOptions = ids
          .map((id) => options.find((o) => o.id === id)!)
          .filter((o) => !!o)
        // console.log('===cellOptions:', cellOptions)
        // console.log('=====options:', options, 'cellOptions:', cellOptions)

        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: cellOptions.map((o) => o.name).join(','),
          data: {
            kind:
              ColumnType.SINGLE_SELECT === column.columnType
                ? 'single-select-cell'
                : 'multiple-select-cell',
            column,
            options: cellOptions,
            data: cellOptions.map((o) => o.id),
          },
        } as SingleSelectCell

        // } as SingleSelectCell | MultipleSelectCell
      }

      if (
        [ColumnType.CREATED_AT, ColumnType.UPDATED_AT].includes(
          column.columnType as any,
        )
      ) {
        const isCreatedAt = ColumnType.CREATED_AT === column.columnType

        const date = isCreatedAt
          ? new Date(record.createdAt)
          : new Date(record.updatedAt)
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          readonly: true,
          copyData: format(date, 'yyyy-MM-dd HH:mm:ss'),
          data: {
            kind: 'system-date-cell',
            data: date,
          },
        } as SystemDateCell
      }

      return {
        kind: getKind(),
        allowOverlay: ColumnType.NODE_ID !== column.columnType,
        readonly: ColumnType.NODE_ID === column.columnType,
        data: cellData,
        displayData: cellData,
      }
    },
    [columnsMap, currentView, records],
  )

  const setCellValue = async (
    [colIndex, rowIndex]: Item,
    newValue: EditableGridCell,
  ): Promise<void> => {
    const record = records[rowIndex]
    const column = sortedColumns[colIndex]

    let data: any = newValue.data

    // for custom cells
    if (typeof data === 'object') {
      data = data.data
    }

    const newDatabase = produce(database, (draft) => {
      draft.records[rowIndex].columns = {
        ...(record.columns as any),
        [column.id]: data,
      }

      // hack for create option
      if (typeof newValue.data === 'object') {
        const newOption = (newValue?.data as any)?.newOption
        if (newOption) {
          for (const item of draft.columns) {
            if (item.id === column.id) {
              const options = (item.options as any as Option[]) || []
              item.options = [...options, newOption]
              break
            }
          }
        }
      }
    })

    queryClient.setQueriesData(
      {
        queryKey: [
          'database',
          [PROJECT_DATABASE_NAME, FRIEND_DATABASE_NAME].includes(database.slug)
            ? database.slug
            : database.id,
        ],
      },
      newDatabase,
    )

    await api.database.updateRecord.mutate({
      recordId: record.id,
      columns: {
        ...(record.columns as any),
        [column.id]: data,
      },
    })
  }

  function onColumnResize(
    column: GridColumn,
    newSize: number,
    colIndex: number,
    newSizeWithGrow: number,
  ) {
    const newCols = produce(cols, (draft) => {
      draft[colIndex] = { ...draft[colIndex], width: newSize }
    })

    setCols(newCols)
  }

  async function onColumnResizeEnd(
    column: GridColumn,
    newSize: number,
    colIndex: number,
    newSizeWithGrow: number,
  ) {
    await api.database.updateViewColumn.mutate({
      viewId: currentView.id,
      columnId: column.id!,
      width: newSize,
    })
  }

  const onDeleteColumn = useCallback(
    async (columnId: string) => {
      const newCols = cols.filter((col) => col.id !== columnId)
      setCols(newCols)
      await deleteColumn(columnId)
    },
    [cols, deleteColumn],
  )

  const onRowAppended = useCallback(() => {
    addRecord()
  }, [addRecord])

  useEffect(() => {
    const newCols = getCols(columns, viewColumns)
    // TODO: has bug when resize columns;
    if (!isEqual(cols, newCols)) {
      setCols(newCols)
    }
    // TODO: don't add cols to deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [database.columns, database.views])

  return {
    gridRef,
    records,
    // filterRows,
    // rowsNum: cellNodesMapList.length,
    sortedColumns,
    rowsNum: records.length,
    cols,
    getContent,
    setCellValue,
    onColumnResize,
    onColumnResizeEnd,
    onDeleteColumn,
    onRowAppended,
  }
}
