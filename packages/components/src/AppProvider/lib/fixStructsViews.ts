import isEqual from 'react-fast-compare'
import { produce } from 'immer'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'

export async function fixStructsViews(areaId: string, structs: IStructNode[]) {
  let needFixed = false

  for (const struct of structs) {
    const { columns, views } = struct.props

    const some = views.some((view) => {
      if (view.viewColumns.length !== columns.length) return true
      const columnIds1 = view.viewColumns.map((v) => v.columnId).sort()
      const columnIds2 = columns.map((c) => c.id).sort()
      return !isEqual(columnIds1, columnIds2)
    })

    if (some) {
      needFixed = true
      console.log('fix struct views............')

      const newViews = produce(views, (draft) => {
        for (const view of draft) {
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
