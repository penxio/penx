import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@fower/react'
import DataEditor, {
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
  type GridColumn,
} from '@glideapps/glide-data-grid'
import { INode } from '@penx/model-types'

const defaultProps: Partial<DataEditorProps> = {
  smoothScrollX: true,
  smoothScrollY: true,
  getCellsForSelection: true,
  width: '100%',
  height: '100%',
}

export interface IDashboardTable {
  spaceNodes: INode[]
}

interface IColumns {
  title: string
  id: string
  hasMenu?: boolean
  dataType?: 'Bubble' | 'Image' | 'DatePicker' | 'Number' | 'SingleDropdown'
  width?: number
}

export function DashboardTable({ spaceNodes }: IDashboardTable) {
  const [numRows, setNumRows] = useState<number>(0)
  const [columns, setColumns] = useState<IColumns[]>([])

  const ref = useRef<DataEditorRef>(null)

  const getContent = useCallback(
    (cell: Item): GridCell => {
      try {
        const [col, row] = cell
        const rowData = spaceNodes[row]
        const colData = columns[col]
        const target = rowData[colData.id as keyof INode]

        if (typeof target === 'object') {
          const data = JSON.stringify(target)
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: data,
            data,
          }
        } else {
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: target ? target.toString() : '',
            data: target ? target.toString() : '',
          }
        }
      } catch (error) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: 'render row failed',
          data: error ? error.toString() : 'error msg',
        }
      }
    },
    [columns],
  )

  const generateColumns = useCallback((sNodes: INode[]) => {
    if (sNodes.length) {
      const columns = []
      const spaceNode = sNodes[0]
      for (const key in spaceNode) {
        if (spaceNode.hasOwnProperty(key)) {
          columns.push({
            title: key,
            id: key,
            hasMenu: false,
          })
        }
      }

      setColumns(columns)
    }
  }, [])

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        // we only have text cells, might as well just die here.
        return
      }
      // not support edite yet
      return
    },
    [columns],
  )

  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    setColumns((preColumns) => {
      const index = preColumns.findIndex((ci) => ci.id === column.id)
      const newArray = [...preColumns]
      newArray.splice(index, 1, {
        ...preColumns[index],
        width: newSize,
      })

      return newArray
    })
  }, [])

  useEffect(() => {
    generateColumns(spaceNodes)
    setNumRows(spaceNodes.length)
  }, [spaceNodes])

  return (
    <Box h="100%">
      <DataEditor
        {...defaultProps}
        ref={ref}
        columns={columns}
        getCellContent={getContent}
        onCellEdited={onCellEdited}
        rowMarkers={'both'}
        onColumnResize={onColumnResize}
        rows={numRows}
      />
    </Box>
  )
}
