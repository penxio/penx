import { useAtomValue } from 'jotai'
import { areaAtom, moldsAtom } from '@penx/store'

export function useArea() {
  const area = useAtomValue(areaAtom)
  return { area }
}
