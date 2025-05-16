import { useAtomValue } from 'jotai'
import { routerAtom } from '@penx/store'

export function useRouterName() {
  const { name } = useAtomValue(routerAtom)
  return name
}
