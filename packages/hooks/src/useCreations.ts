import { useAtomValue } from 'jotai'
import { Creation } from '@penx/domain'
import { creationsAtom } from '@penx/store'

export function useCreations() {
  const raw = useAtomValue(creationsAtom)

  const creations = raw
    .map((i) => new Creation(i))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  function creationsByStruct(structId: string) {
    return creations.filter((creation) => creation.structId === structId)
  }

  return {
    raw,
    creationsByStruct,
    creations,
  }
}
