import { useAtomValue } from 'jotai'
import { Creation } from '@penx/domain'
import { creationsAtom } from '@penx/store'

export function useCreations() {
  const raw = useAtomValue(creationsAtom)
  return {
    raw,
    creations: raw
      .map((i) => new Creation(i))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  }
}
