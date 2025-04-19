import { calculateSHA256FromString } from '@/lib/encryption'
import { Creation } from '@penx/types'
import { revalidateTag } from 'next/cache'

export function revalidateCreation(_creation: any) {
  const creation = _creation as Creation

  if (creation.mold?.type) {
    revalidateTag(`${creation.siteId}-${creation.mold.type.toLowerCase()}s`)
  }
}

/**
 * Helper function: Invalidate cache for tag-related data
 * @param siteId - The site ID
 * @param postTags - The post tag associations list
 */
export function revalidateCreationTags(
  siteId: string,
  postTags?: { tag: { name: string } }[],
) {
  if (!postTags?.length) return

  postTags.forEach((postTag) => {
    revalidateTag(
      `${siteId}-tags-${calculateSHA256FromString(postTag.tag.name)}`,
    )
  })
}
