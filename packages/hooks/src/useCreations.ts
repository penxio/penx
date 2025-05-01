import { useAtomValue } from 'jotai'
import { creationsAtom } from '@penx/store'

export function useCreations() {
  const creations = useAtomValue(creationsAtom)
  return { creations }
}
