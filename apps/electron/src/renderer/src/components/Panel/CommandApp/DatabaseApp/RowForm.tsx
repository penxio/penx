import { forwardRef } from 'react'
import { Box } from '@fower/react'
import { CellField } from '@penx/cell-fields'
import {
  ICellNode,
  IColumnNode,
  IDatabaseNode,
  IOptionNode,
  IRowNode,
  IViewNode,
} from '@penx/model-types'
import { mappedByKey } from '@penx/shared'
import { FieldIcon } from './FieldIcon'

interface Props {
  rowId: string
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
}

export const RowForm = forwardRef<HTMLDivElement, Props>(
  function TagForm(props, ref) {
    const { columns, views, cells, rowId } = props

    // console.log('========cells；', cells, 'rowId:', rowId)

    const currentView = views[0]

    const columnMap = mappedByKey(columns, 'id')
    const { viewColumns = [] } = currentView.props
    const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

    const rowCells = sortedColumns.map((column) => {
      return cells.find(
        (cell) =>
          cell.props.rowId === rowId && cell.props.columnId === column.id,
      )!
    })

    // console.log('========rowCells:', rowCells)

    return (
      <Box ref={ref} column gap4>
        {rowCells.map((cell, index) => {
          const column = columns.find((col) => col.id === cell.props.columnId)!

          if (!column) return null

          return (
            <Box key={cell.id}>
              <Box mb2 toCenterY gap1 gray600>
                <FieldIcon fieldType={column.props.fieldType} />
                <Box textXS>{column.props.displayName}</Box>
              </Box>
              <CellField index={index} cell={cell} columns={sortedColumns} />
            </Box>
          )
        })}
      </Box>
    )
  },
)
