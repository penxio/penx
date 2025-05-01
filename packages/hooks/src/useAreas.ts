import { useAtomValue } from 'jotai'
import { areasAtom } from '@penx/store'

export function useAreas() {
  const areas = useAtomValue(areasAtom)
  return { areas }
}
