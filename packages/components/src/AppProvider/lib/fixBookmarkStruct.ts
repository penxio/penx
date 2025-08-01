import { t } from '@lingui/core/macro'
import { produce } from 'immer'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'
import { ColumnType, StructType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

// fallback to old data, remove it later
export async function fixBookmarkStruct(
  areaId: string,
  structs: IStructNode[],
) {
  const bookmarkStruct = structs.find(
    (s) => s.props.type === StructType.BOOKMARK,
  )
  if (bookmarkStruct) {
    const iconColumn = bookmarkStruct.props.columns.find(
      (c) => c.slug === 'icon',
    )
    if (!iconColumn) {
      const newStruct = produce(bookmarkStruct, (draft) => {
        draft.props.columns.push({
          id: uniqueId(),
          slug: 'icon',
          name: t`Icon`,
          description: '',
          columnType: ColumnType.URL,
          config: {},
          options: [],
          isPrimary: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })

      await localDB.updateStructProps(bookmarkStruct.id, {
        columns: newStruct.props.columns,
      })
      structs = await localDB.listStructs(areaId)
    }
  }

  return structs
}
