import { format } from 'date-fns'
import { OptionTag } from '@penx/components/OptionTag'
import { Creation } from '@penx/domain'
import { ColumnType, Option } from '@penx/types'
import { mappedByKey } from '@penx/utils'
import { FieldIcon } from '../../../FieldIcon'
import { useDatabaseContext } from '../../DatabaseProvider'

interface Tag {
  text: string
}

interface GalleryViewProps {}

export const GalleryView = ({}: GalleryViewProps) => {
  const { records } = useDatabaseContext()

  return (
    <div className="grid grid-cols-1 gap-4 overflow-auto px-4 py-20 pt-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {records.map((record, index) => (
        <GalleryItem key={record.id} record={record} index={index} />
      ))}
    </div>
  )
}

interface GalleryItemProps {
  record: Creation
  index: number
}

function GalleryItem({ record }: GalleryItemProps) {
  const { columns } = useDatabaseContext()
  const columnMaps = mappedByKey(columns, 'id')
  if (!record.props.cells) return null

  return (
    <div className="border-foreground/10 text-foreground relative mb-5 flex w-full flex-col gap-1 rounded-md border p-4">
      {Object.entries<any>(record.props.cells).map(([key, value]) => {
        const column = columnMaps[key]
        if (!column) return null

        const valueJsx = () => {
          if (column.isPrimary) {
            return record.title
          }

          if (column.columnType === ColumnType.TEXT) {
            return value
          }

          if (column.columnType === ColumnType.DATE) {
            return value ? format(new Date(value), 'PPP') : ''
          }

          if (
            column.columnType === ColumnType.SINGLE_SELECT ||
            column.columnType === ColumnType.MULTIPLE_SELECT
          ) {
            const ids: string[] = value
            const options = column.options as any as Option[]
            return (
              <div className="flex items-center gap-1">
                {options
                  .filter((o) => ids.includes(o.id))
                  .map((o) => (
                    <OptionTag key={o.id} option={o} />
                  ))}
              </div>
            )
          }
          return value?.toString()
        }

        return (
          <div key={key} className="flex justify-between">
            <div className="flex items-center gap-1 text-sm font-medium">
              <FieldIcon columnType={column.columnType as any} />
              <div>{column.name}</div>
            </div>
            <div>{valueJsx()}</div>
          </div>
        )
      })}
    </div>
  )
}
