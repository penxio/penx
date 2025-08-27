import { produce } from 'immer'
import _ from 'lodash'
import { IChange, OperationType } from '@penx/model-type'

export function mergeChanges(changes: IChange[]) {
  const grouped = changes.reduce(
    (acc, cur) => {
      if (!acc[cur.key]) acc[cur.key] = []
      acc[cur.key].push(cur)
      return acc
    },
    {} as Record<string, IChange[]>,
  )

  const mergedChanges = Object.values(grouped)
    .map((list) => {
      const first = _.first(list) as IChange
      const last = _.last(list) as IChange
      const isAllUpdate = list.every(
        (change) => change.operation === OperationType.UPDATE,
      )
      if (isAllUpdate) {
        const data = list.reduce(
          (acc, cur) => ({ ...acc, ...cur.data }),
          {} as Record<string, any>,
        )
        return { ...last, data }
      }

      if (
        first?.operation === OperationType.CREATE &&
        last?.operation === OperationType.DELETE
      ) {
        return null
      }

      if (last?.operation === OperationType.DELETE) {
        return last as IChange
      }

      if (list[0].operation === OperationType.CREATE) {
        if (list.length === 1) return first
        const [_, ...updateList] = list

        const props = updateList.reduce(
          (acc, cur) => ({ ...acc, ...cur.data }),
          first.data.props,
        )

        return produce(first, (draft) => {
          draft.createdAt = first.data.createdAt
          draft.data.props = props
          draft.data.createdAt = first.data.createdAt
          draft.data.updatedAt = last.data.updatedAt
        })
      }
      return null
    })
    .filter((change) => !!change)

  return mergedChanges
}
