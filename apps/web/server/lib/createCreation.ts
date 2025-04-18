import { cacheHelper } from '@/lib/cache-header'
import { FREE_PLAN_POST_LIMIT } from '@/lib/constants'
import { CreateCreationInput } from '@/lib/constants/schema.constants'
import { calculateSHA256FromString } from '@/lib/encryption'
import { CatalogueNodeJSON, CatalogueNodeType } from '@/lib/model'
import { CreationType, Prop } from '@/lib/theme.types'
import { uniqueId } from '@/lib/unique-id'
import { prisma } from '@penx/db'
import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { findCreations } from './findCreations'
import { findNotes } from './findNotes'
import { getCreation } from './getCreation'

export async function createCreation(
  siteId: string,
  userId: string,
  isFree: boolean,
  input: CreateCreationInput,
) {
  const {
    tagIds = [],
    isPublishDirectly = false,
    props: inputProps,
    ...data
  } = input
  const creation = await prisma.$transaction(
    async (tx) => {
      const count = await tx.creation.count({
        where: { siteId: data.siteId },
      })

      if (count >= FREE_PLAN_POST_LIMIT && isFree) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have reached the free plan creation limit.',
        })
      }

      /** create props */
      let props: Record<string, any> = {}

      if (inputProps) {
        const mold = await tx.mold.findUnique({
          where: {
            siteId_type: {
              siteId,
              type: input.type,
            },
          },
        })
        const moldProps = (mold?.props || []) as Prop[]
        for (const item of moldProps) {
          if (inputProps[item.slug]) {
            props[item.id] = inputProps[item.slug]
          }
        }
      }

      const creation = await tx.creation.create({
        data: {
          userId: data.userId || userId,
          i18n: {},
          ...data,
          props,
          authors: {
            create: [
              {
                siteId,
                userId: data.userId || userId,
              },
            ],
          },
        },
      })

      if (tagIds.length) {
        const res = await tx.creationTag.createMany({
          data: tagIds.map((tagId) => ({
            siteId,
            creationId: creation.id,
            tagId,
          })),
        })

        const tags = await tx.tag.findMany({
          where: { id: { in: tagIds } },
        })

        for (const tag of tags) {
          revalidateTag(`${siteId}-tags-${calculateSHA256FromString(tag.name)}`)
        }

        revalidateTag(`${siteId}-tags`)
      }

      if (data.areaId) {
        const area = await tx.area.findUniqueOrThrow({
          where: { id: data.areaId },
        })

        const catalogue = (area.catalogue || []) as any as CatalogueNodeJSON[]

        catalogue.push({
          id: uniqueId(),
          type: CatalogueNodeType.POST,
          uri: creation.id,
        })

        await tx.area.update({
          where: {
            id: data.areaId,
          },
          data: { catalogue: catalogue as any },
        })
      }

      if (!data.areaId) {
        await cacheHelper.updateMoldCreations(
          creation.siteId,
          creation.moldId!,
          null,
        )
      }

      return creation
    },
    {
      maxWait: 10000, // default: 2000
      timeout: 20000, // default: 5000
    },
  )

  const newCreation = await getCreation(creation.id)
  await cacheHelper.updateCreation(creation.id, newCreation)

  let creations = await findCreations({ areaId: creation.areaId! })
  await cacheHelper.updateAreaCreations(creation.areaId!, creations)

  if (creation.type === CreationType.NOTE) {
    let notes = await findNotes({
      moldId: creation.moldId!,
      areaId: creation.areaId!,
    })
    await cacheHelper.updateNotes(creation.areaId!, notes)
  }

  return creation
}
