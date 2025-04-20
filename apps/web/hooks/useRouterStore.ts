import { routerAtom, store } from '@penx/store'
import { useAtomValue } from 'jotai'

export function useRouterStore() {
  useAtomValue(routerAtom)
  return store.router
}
