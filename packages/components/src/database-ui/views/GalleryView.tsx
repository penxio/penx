import { OptionTag } from '@penx/components/OptionTag'
import { mappedByKey } from '@penx/utils'
import { ColumnType, Option } from '@penx/types'
import { Record as Row } from '@prisma/client'
import { useDatabaseContext } from '../DatabaseProvider'
import { FieldIcon } from '../shared/FieldIcon'

interface Tag {
  text: string
}

interface GalleryViewProps {}

export const GalleryView = ({}: GalleryViewProps) => {
  const { database } = useDatabaseContext()
  const { records } = database

  return (
    <div className="grid grid-cols-1 gap-4 py-20 pt-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {records.map((record, index) => (
        <GalleryItem key={record.id} record={record} index={index} />
      ))}
    </div>
  )
}

interface GalleryItemProps {
  record: Row
  index: number
}

function GalleryItem({ record }: GalleryItemProps) {
  const { database } = useDatabaseContext()
  const fieldMaps = mappedByKey(database.columns, 'id')

  return (
    <div className="border-foreground/10 relative mb-5 flex w-full flex-col gap-1 rounded-md border p-4">
      {Object.entries<any>(record.columns as Record<string, any>).map(
        ([key, value]) => {
          const field = fieldMaps[key]

          const valueJsx = () => {
            if (field.columnType === ColumnType.TEXT) {
              return value
            }

            if (
              field.columnType === ColumnType.SINGLE_SELECT ||
              field.columnType === ColumnType.MULTIPLE_SELECT
            ) {
              const ids: string[] = value
              const options = field.options as any as Option[]
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
                <FieldIcon columnType={field.columnType as any} />
                <div>{field.displayName}</div>
              </div>
              <div>{valueJsx()}</div>
            </div>
          )
        },
      )}
    </div>
  )
}
