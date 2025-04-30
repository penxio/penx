import { useAtomValue } from 'jotai'
import { moldsAtom } from '@penx/store'

export function useMolds() {
  const molds = useAtomValue(moldsAtom)
  return { molds }
}
