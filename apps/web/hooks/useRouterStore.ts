import { routerAtom, store } from '@/store'
import { useAtomValue } from 'jotai'

export function useRouterStore() {
  useAtomValue(routerAtom)
  return store.router
}
