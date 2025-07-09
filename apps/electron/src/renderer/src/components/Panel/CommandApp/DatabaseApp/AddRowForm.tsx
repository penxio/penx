import { Box } from '@fower/react'
import { Button, Input } from 'uikit'
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
  database: IDatabaseNode
  views: IViewNode[]
  columns: IColumnNode[]
  rows: IRowNode[]
  cells: ICellNode[]
  options: IOptionNode[]
}

export function AddRowForm(props: Props) {
  const { columns, views, cells } = props
  const currentView = views[0]
  const columnMap = mappedByKey(columns, 'id')
  const { viewColumns = [] } = currentView.props
  const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

  return (
    <Box toCenterX>
      <Box w-400 column gap4>
        {sortedColumns.map((column, index) => {
          return (
            <Box key={column.id}>
              <Box mb2 toCenterY gap1 gray600>
                <FieldIcon fieldType={column.props.fieldType} />
                <Box textXS>{column.props.displayName}</Box>
              </Box>
              <Input></Input>
            </Box>
          )
        })}

        <Button>Save</Button>
      </Box>
    </Box>
  )
}
