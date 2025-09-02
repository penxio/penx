import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { Box } from '@fower/react'
import { IDataListItem } from '@penx/extension-api'

interface DataListItemProps {
  item: IDataListItem
}
export const DataListItem = memo(
  function DataListItem({ item }: DataListItemProps) {
    return (
      <Box toBetween toCenterY>
        <Box>{item.label}</Box>
        <Box>{item.value}</Box>
      </Box>
    )
  },
  (prev, next) => {
    return isEqual(prev, next)
  },
)
