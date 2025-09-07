import { Creation, Struct } from '@penx/domain'

export function getCreationFields<T = any>(struct: Struct, creation: Creation) {
  const columns = struct.columns

  const result = columns.reduce(
    (acc, cur) => {
      return {
        ...acc,
        [cur.slug]: creation.cells[cur.id],
        title: creation.title,
      }
    },
    {} as Record<string, any>,
  )
  return result as T
}
