import { produce } from 'immer'
import { Struct } from '@penx/domain'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'

export async function fixStructs(areaId: string, structs: IStructNode[]) {
  let needFixed = false

  for (const struct of structs) {
    const { columns, views } = struct.props

    const some = views.some(
      (view) => view.viewColumns.length !== columns.length,
    )
    if (some) {
      needFixed = true
      const newViews = produce(views, (draft) => {
        for (const view of views) {
          view.viewColumns = columns.map((c) => ({
            columnId: c.id,
            visible: true,
            width: 160,
          }))
        }
      })

      await localDB.updateStructProps(struct.id, {
        views: newViews,
      })
    }
  }

  if (needFixed) {
    return await localDB.listStructs(areaId)
  }

  return structs
}
