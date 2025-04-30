import { useAtomValue } from 'jotai'
import { tagsAtom } from '@penx/store'

export function useTags() {
  const tags = useAtomValue(tagsAtom)
  return { tags }
}
