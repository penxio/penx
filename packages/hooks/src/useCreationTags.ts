import { useAtomValue } from 'jotai'
import { CreationTag } from '@penx/domain'
import { creationTagsAtom } from '@penx/store'

export function useCreationTags() {
  const raw = useAtomValue(creationTagsAtom)

  const creationTags = raw.map((i) => new CreationTag(i))
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
