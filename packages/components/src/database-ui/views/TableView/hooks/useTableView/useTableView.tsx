'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import {
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from '@glideapps/glide-data-grid'
import { format } from 'date-fns'
import { produce } from 'immer'
import { useDatabaseContext } from '@penx/components/database-ui'
import { DateCell } from '@penx/components/date-cell'
import { FileCell } from '@penx/components/file-cell'
import { ImageCell } from '@penx/components/image-cell'
import {
  PasswordCell,
  passwordCellRenderer,
} from '@penx/components/password-cell'
import { PrimaryCell } from '@penx/components/primary-cell'
import { RateCell } from '@penx/components/rate-cell'
import { SingleSelectCell } from '@penx/components/single-select-cell'
import { SystemDateCell } from '@penx/components/system-date-cell'
import { FRIEND_DATABASE_NAME, PROJECT_DATABASE_NAME } from '@penx/constants'
import { Struct } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { store } from '@penx/store'
import { ColumnType, Option, ViewColumn } from '@penx/types'
import { mappedByKey } from '@penx/utils'

function getCols(struct: Struct) {
  const sortedColumns = struct.currentView.viewColumns
    .filter((v) => v.visible)
    .map(({ columnId }) => {
      return struct.columns.find((col) => col.id === columnId)!
    })

  const viewColumnsMapped = mappedByKey(
    struct.currentView.viewColumns,
    'columnId',
  )

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
      title: column.name || '',
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
  const {
    struct,
    // filterResult: { filterRows = [], cellNodesMapList = [] },
    currentView,
    deleteColumn,
    sortedColumns,
    addRecord,
  } = useDatabaseContext()
  const { columns } = struct

  const { creations, raw: creationNodes, creationsByStruct } = useCreations()
  const records = creationsByStruct(struct.id)
  const columnsMap = mappedByKey(columns, 'id')
  const rowsMap = mappedByKey(records, 'id')
  const [cols, setCols] = useState(getCols(struct))

  const gridRef = useRef<DataEditorRef>(null)

  const getContent = (cell: Item): GridCell => {
    const [col, row] = cell

    // For debug
    try {
      columnsMap[currentView.viewColumns[col].columnId]
    } catch (error) {
      console.log(
        '======struct:',
        struct,
        currentView.viewColumns,
        col,
        'cols:',
        cols,
      )
    }

    // Hack fallback
    if (cols.length > struct.columns.length) {
      return {
        kind: GridCellKind.Text,
        // allowOverlay: ColumnType.NODE_ID !== column.columnType,
        // readonly: ColumnType.NODE_ID === column.columnType,
        allowOverlay: true,
        readonly: false,
        data: '',
        displayData: '',
      }
    }

    const column = columnsMap[currentView.viewColumns[col].columnId]

    const record = records[row]
    const cells = record.props.cells

    function getCellData() {
      if (!record) return ''
      if (column.isPrimary) return record.title
      let cellData = cells?.[column.id]

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

    if (column.columnType === ColumnType.PRIMARY) {
      return {
        kind: GridCellKind.Custom,
        allowOverlay: true,
        copyData: cellData,

        data: {
          kind: 'primary-cell',
          data: cellData,
          record: record,
        },
      } as PrimaryCell
    }

    if (column.columnType === ColumnType.DATE) {
      // console.log('======cellData:', cellData, 'column:', column)
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

      const options = column.options

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
          column: column,
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
      // allowOverlay: ColumnType.NODE_ID !== column.columnType,
      // readonly: ColumnType.NODE_ID === column.columnType,
      allowOverlay: true,
      readonly: false,
      data: cellData,
      displayData: cellData,
    }
  }

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

    const newCreation = produce(record.raw, (draft) => {
      if (colIndex === 0) {
        draft.props.title = data
      } else {
        draft.props.cells[column.id] = data
      }
    })

    if (colIndex === 0) {
      store.creations.updateCreationById(record.id, {
        props: {
          ...record.props,
          title: data,
        },
      })

      await localDB.updateCreationProps(record.id, {
        title: data,
      })
    } else {
      store.creations.updateCreationById(record.id, {
        props: {
          ...record.props,
          cells: newCreation.props.cells,
        },
      })

      await localDB.updateCreationProps(record.id, {
        cells: newCreation.props.cells,
      })
    }

    console.log('=======newValue:', newValue)

    // const newDatabase = produce(database, (draft) => {

    //   // hack for create option
    //   if (typeof newValue.data === 'object') {
    //     const newOption = (newValue?.data as any)?.newOption
    //     if (newOption) {
    //       for (const item of draft.columns) {
    //         if (item.id === column.id) {
    //           const options = (item.options as any as Option[]) || []
    //           item.options = [...options, newOption]
    //           break
    //         }
    //       }
    //     }
    //   }
    // })
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
    const newStruct = produce(struct.raw, (draft) => {
      for (const view of draft.props.views) {
        if (view.id === currentView.id) {
          const index = view.viewColumns.findIndex(
            (i) => i.columnId === column.id,
          )
          view.viewColumns[index].width = newSize
          break
        }
      }
    })

    store.structs.updateStruct(struct.id, newStruct)

    await localDB.updateStructProps(struct.id, {
      views: newStruct.props.views,
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
    const newCols = getCols(struct)

    // TODO: has bug when resize columns;
    if (!isEqual(cols, newCols)) {
      setCols(newCols)
    }
    // TODO: don't add cols to deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [struct])

  return {
    gridRef,
    records: records.reverse(),
    // filterRows,
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
