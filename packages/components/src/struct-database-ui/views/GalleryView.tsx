import { OptionTag } from '@penx/components/OptionTag'
import { Creation } from '@penx/domain'
import { ColumnType, Option } from '@penx/types'
import { mappedByKey } from '@penx/utils'
import { useDatabaseContext } from '../DatabaseProvider'
import { FieldIcon } from '../shared/FieldIcon'

interface Tag {
  text: string
}

interface GalleryViewProps {}

export const GalleryView = ({}: GalleryViewProps) => {
  const { records } = useDatabaseContext()
  console.log('======records:', records)

  return (
    <div className="grid grid-cols-1 gap-4 py-20 pt-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
  console.log('=======columns:', columns)

  return (
    <div className="border-foreground/10 relative mb-5 flex w-full flex-col gap-1 rounded-md border p-4">
      {Object.entries<any>(record.props.props).map(([key, value]) => {
        const column = columnMaps[key]
        console.log(
          '=====column:',
          column,
          'record.props.props:',
          record.props.props,
        )
        if (!column) return null

        const valueJsx = () => {
          if (column.isPrimary) {
            return record.title
          }

          if (column.columnType === ColumnType.TEXT) {
            return value
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
