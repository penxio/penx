import { useAtomValue } from 'jotai'
import { isMobileApp } from '@penx/constants'
import { Struct } from '@penx/domain'
import { structsAtom } from '@penx/store'
import { StructType } from '@penx/types'

export function useStructs(isTaskFirst = false) {
  const raw = useAtomValue(structsAtom)

  const sortKeys: string[] = [
    StructType.VOICE,
    StructType.PAGE,
    StructType.ARTICLE,
    StructType.AUDIO,
    StructType.IMAGE,
    StructType.BOOKMARK,
    StructType.FRIEND,
    StructType.PROJECT,
  ]

  if (isTaskFirst) {
    sortKeys.unshift(StructType.NOTE)
    sortKeys.unshift(StructType.TASK)
  } else {
    sortKeys.unshift(StructType.TASK)
    sortKeys.unshift(StructType.NOTE)
  }

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
