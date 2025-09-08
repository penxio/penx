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
      <div className="flex items-center justify-between">
        <div>{item.label}</div>
        <div>{item.value}</div>
      </div>
    )
  },
  (prev, next) => {
    return isEqual(prev, next)
  },
)
