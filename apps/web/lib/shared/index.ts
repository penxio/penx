export * from './useCopyToClipboard'
export * from './docToMarkdown'
export * from './md5'
export * from './getConnectionState'
export * from './normalizeNodes'

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function matchNumber(input: string, precision = 10) {
  const regex = new RegExp(`^(\\d+)?(\\.\\d{0,${precision}}?)?$`)
  return regex.test(input)
}

/**
 * @example
 * const old = [{id: 1, someKey: "foo"}, {id: 2, someKey: "bar"}]
 * to
 * const new = {1: {id: 1, someKey: "foo"}, 2:{id: 2, someKey: "bar"}  }
 * @param items
 */
export function mappedByKey<T>(items: T[] = [], key = 'id') {
  return items.reduce<Record<string, T>>((result, i: any) => {
    return { ...result, [i[key]]: i }
  }, {})
}
