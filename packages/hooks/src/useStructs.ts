import { useAtomValue } from 'jotai'
import { Struct } from '@penx/domain'
import { structsAtom } from '@penx/store'
import { StructType } from '@penx/types'

export function useStructs() {
  const raw = useAtomValue(structsAtom)

  const sortKeys = [
    StructType.PAGE,
    StructType.NOTE,
    StructType.TASK,
    StructType.ARTICLE,
    StructType.AUDIO,
    StructType.IMAGE,
    StructType.BOOKMARK,
    StructType.FRIEND,
    StructType.PROJECT,
  ]

  return {
    raw,
    structs: raw
      .map((m) => new Struct(m))
      .sort((a, b) => {
        const indexA = sortKeys.indexOf(a.type as any)
        const indexB = sortKeys.indexOf(b.type as any)
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return 0
      }),
  }
}
