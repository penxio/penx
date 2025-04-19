import { cacheHelper } from '@penx/libs/cache-header'
import { prisma } from '@penx/db'
import { revalidateCreationTags } from '@penx/api/lib/revalidateCreation'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { findCreations } from './findCreations'

export const addCreationTagInputSchema = z.object({
  tagId: z.string(),
  siteId: z.string(),
  creationId: z.string(),
})

export type AddCreationTagInput = z.infer<typeof addCreationTagInputSchema>

function revalidate(siteId: string) {
  revalidateTag(`${siteId}-tags`)
}

export async function addCreationTag(input: AddCreationTagInput) {
  const creationTag = await prisma.creationTag.create({
    data: { ...input },
    include: { tag: true, creation: true },
  })

  await prisma.tag.update({
    where: { id: creationTag.tagId },
    data: {
      creationCount: {
        increment: 1,
      },
    },
  })

  revalidate(creationTag.siteId)
  revalidateCreationTags(creationTag.siteId, [{ tag: creationTag.tag }])

  const creationTags = await prisma.creationTag.findMany({
    where: { creationId: input.creationId },
    include: { tag: true },
  })

  const creation = await cacheHelper.updateCreationProps(input.creationId, {
    creationTags: creationTags,
  })

  if (creation) {
    let creations = await findCreations({ areaId: creation.areaId! })
    await cacheHelper.updateAreaCreations(creation.areaId!, creations)
  }

  await cacheHelper.updateAreaCreations(creationTag.creation.areaId!, null)
  await cacheHelper.updateMoldCreations(
    creationTag.siteId,
    creationTag.creation.moldId!,
    null,
  )
  return creationTag
}
