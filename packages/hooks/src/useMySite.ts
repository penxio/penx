import { useAtomValue } from 'jotai'
import { Site } from '@penx/domain'
import { siteAtom } from '@penx/store'

export function useMySite() {
  const raw = useAtomValue(siteAtom)
  return {
    raw,
    site: new Site(raw),
  }
}
