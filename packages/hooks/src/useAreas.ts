import { useAtomValue } from 'jotai'
import { Area } from '@penx/domain'
import { areasAtom } from '@penx/store'

export function useAreas() {
  const raw = useAtomValue(areasAtom)
  return {
    raw,
    areas: raw.map((area) => new Area(area)),
  }
}
