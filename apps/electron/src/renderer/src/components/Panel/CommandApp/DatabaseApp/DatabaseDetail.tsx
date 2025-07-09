import { useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { useValue } from '~/hooks/useValue'
import { StyledCommandEmpty, StyledCommandGroup } from '../../CommandComponents'
import { ListItemUI } from '../../ListItemUI'
import { RowForm } from './RowForm'
import { IStructNode } from '@penx/model-type'
import { Separator } from '@penx/uikit/ui/separator'
import { ICommandItem } from '~/lib/types'
import { mappedByKey } from '@penx/utils'
import { useCreations } from '@penx/hooks/useCreations'
import { Struct } from '@penx/domain'

interface Props {
  text: string
  struct: IStructNode
}

interface Item {
  struct: IStructNode
}

export function DatabaseDetail(props: Props) {
  const { value, setValue } = useValue()
  const { creations } = useCreations()
  const { text } = props
  const struct = new Struct(props.struct)
  const rows = creations.filter((c) => c.structId === struct.id)

  const filteredRows = useMemo(() => {
    return rows.map((item) => {
      return {
        //
      } as ICommandItem
    })
  }, [rows])

  // const { columns, rows, views, cells } = rest
  // const currentView = views[0]
  // const { viewColumns = [] } = currentView.props
  // const columnMap = mappedByKey(columns, 'id')
  // const sortedColumns = viewColumns.map(({ columnId }) => columnMap[columnId])

  // const filteredRows: Item[] = useMemo(() => {
  //   const items = rows
  //     .map((row) => {
  //       const rowCells = cells.filter((cell) => cell.props.rowId === row.id)

  //       if (!text) {
  //         const cell = rowCells.find((cell) => cell.props.columnId === sortedColumns[0].id)!
  //         return { row, rowCells, cell }
  //       }

  //       const cell = rowCells.find((cell) => {
  //         // console.log('cell-----:', cell.props.data)
  //         const data = String(cell.props?.data || '').toLowerCase()
  //         return data.includes(text.toLowerCase())
  //       })!
  //       return { row, rowCells, cell }
  //     })
  //     .filter((item) => !!item.cell)
  //     .slice(0, 20)
  //   return items
  // }, [rows, cells, text, sortedColumns])

  // useEffect(() => {
  //   if (!isUuidV4(value) && filteredRows.length) {
  //     setValue(filteredRows[0].row.id)
  //   }
  // }, [filteredRows, value, setValue])

  // // console.log('=======filteredRows:', filteredRows, 'value:', value)
  // const currentItem = filteredRows.find((item) => item.row.id === value)

  // if (!filteredRows.length)
  //   return (
  //     <StyledCommandGroup block--i>
  //       <StyledCommandEmpty gray500>No results found.</StyledCommandEmpty>
  //     </StyledCommandGroup>
  //   )

  console.log('struct======>>>>:', struct)

  return (
    <Box toLeft overflowHidden absolute top0 bottom0 left0 right0>
      <StyledCommandGroup p2 flex-2 overflowYAuto>
        {rows.map((item, index) => {
          console.log('====item:', item)

          const listItem = {
            title: item.title
          } as ICommandItem
          return (
            <ListItemUI
              key={index}
              index={index}
              showIcon={false}
              value={item.id}
              item={listItem}
            />
          )
        })}
      </StyledCommandGroup>

      <Separator orientation="vertical" />

      <Box flex-3 overflowAuto p3>
        {/* {currentItem && (
          <DatabaseProvider {...rest}>
            <RowForm {...rest} rowId={currentItem.row.id} />
          </DatabaseProvider>
        )} */}
        <div>Right</div>
      </Box>
    </Box>
  )
}

function dataToString(data: any) {
  if (!data) return 'Untitled'
  if (typeof data === 'string') return data
  if (typeof data === 'number') return data.toString()
  if (Array.isArray(data)) return data.join(',')
  return JSON.stringify(data, null)
}

function isUuidV4(uuid: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidV4Regex.test(uuid)
}
