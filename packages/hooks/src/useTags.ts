import { useAtomValue } from 'jotai'
import { Tag } from '@penx/domain'
import { tagsAtom } from '@penx/store'

export function useTags() {
  const raw = useAtomValue(tagsAtom)
  return {
    raw,
    tags: raw.map((t) => new Tag(t)),
  }
}
