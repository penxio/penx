import { useAtomValue } from 'jotai'
import { creationTagsAtom } from '@penx/store'

export function useCreationTags() {
  const creationTags = useAtomValue(creationTagsAtom)

  return {
    creationTags,
    queryByCreation(creationId: string) {
      return creationTags
        .filter((tag) => tag.creationId === creationId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
    },
  }
}
