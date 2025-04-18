import { routerAtom } from '@/store'
import { useAtomValue } from 'jotai'

export function useRouterName() {
  const { name } = useAtomValue(routerAtom)
  return name
}
