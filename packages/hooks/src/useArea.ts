import { useAtomValue } from 'jotai'
import { Area } from '@penx/domain'
import { areaAtom } from '@penx/store'

export function useArea() {
  const raw = useAtomValue(areaAtom)
  return {
    raw,
    area: new Area(raw),
  }
}
