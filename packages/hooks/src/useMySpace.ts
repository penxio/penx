import { useAtomValue } from 'jotai'
import { Space } from '@penx/domain'
import { spaceAtom } from '@penx/store'

export function useMySpace() {
  const raw = useAtomValue(spaceAtom)
  return {
    raw,
    space: new Space(raw),
  }
}
