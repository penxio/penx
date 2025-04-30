import { useAtomValue } from 'jotai'
import { siteAtom } from '@penx/store'

export function useMySite() {
  const site = useAtomValue(siteAtom)
  return { site }
}
