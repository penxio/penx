import { cacheHelper } from '@penx/libs/cache-header'
import { getRandomColorName } from '@penx/libs/color-helper'
import { prisma } from '@penx/db'
import { revalidateCreationTags } from '@penx/api/lib/revalidateCreation'
import { Tag } from '@penx/db/client'
import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { addCreationTag } from '../lib/addCreationTag'
import { protectedProcedure, publicProcedure, router } from '../trpc'

function revalidate(siteId: string) {
  revalidateTag(`${siteId}-tags`)
}

export const tagRouter = router({
  list: publicProcedure.query(async () => {
    const tags = await prisma.tag.findMany()
    return tags
  }),

  listSiteTags: publicProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const tags = await prisma.tag.findMany({
        where: { siteId: input.siteId },
      })
      return tags
    }),

  create: protectedProcedure
    .input(
      z.object({
        creationId: z.string(),
        siteId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.$transaction(
        async (tx) => {
          const tagName = slug(input.name)
          let tag = await tx.tag.findFirst({
            where: { name: tagName, siteId: input.siteId },
          })

          let newTag: Tag | undefined = undefined
          if (!tag) {
            tag = await tx.tag.create({
              data: {
                siteId: input.siteId,
                name: tagName,
                userId: ctx.token.uid,
                color: getRandomColorName(),
              },
            })
            newTag = tag

            await cacheHelper.updateMySites(ctx.token.uid, null)
          }

          const creationTag = await tx.creationTag.findFirst({
            where: { creationId: input.creationId, tagId: tag.id },
          })

          if (creationTag) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Tag already exists',
            })
          }

          const newCreationTag = await tx.creationTag.create({
            data: {
              siteId: input.siteId,
              creationId: input.creationId,
              tagId: tag.id,
            },
            include: { tag: true },
          })

          await tx.tag.update({
            where: { id: tag.id },
            data: {
              creationCount: tag.creationCount + 1,
            },
          })

          revalidate(tag.siteId)

          return {
            tag: newTag,
            creationTag: newCreationTag,
          }
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  add: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        tagId: z.string(),
        siteId: z.string(),
        creationId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return addCreationTag(input)
    }),

  deleteTag: protectedProcedure
    .input(
      z.object({
        tagId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.$transaction(
        async (tx) => {
          const tag = await tx.tag.findUniqueOrThrow({
            where: { id: input.tagId },
          })
          await tx.creationTag.deleteMany({
            where: { tagId: input.tagId },
          })

          await tx.tag.delete({
            where: { id: input.tagId },
          })

          revalidate(tag.siteId)
          revalidateCreationTags(tag.siteId, [{ tag: tag }])
          return true
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  deleteCreationTag: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const creationTag = await prisma.creationTag.delete({
        where: { id: input },
        include: { tag: true, creation: true },
      })

      await prisma.tag.update({
        where: { id: creationTag.tagId },
        data: {
          creationCount: {
            decrement: 1,
          },
        },
      })

      revalidate(creationTag.siteId)
      revalidateCreationTags(creationTag.siteId, [{ tag: creationTag.tag }])
      await cacheHelper.updateCreation(creationTag.creationId, null)
      await cacheHelper.updateMoldCreations(
        creationTag.siteId,
        creationTag.creation.moldId!,
        null,
      )
      return creationTag
    }),

  updateTag: protectedProcedure
    .input(
      z.object({
        tagId: z.string().uuid(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { tagId, ...rest } = input
      const tag = await prisma.tag.update({
        where: { id: input.tagId },
        data: rest,
      })

      revalidate(tag.siteId)
      revalidateCreationTags(tag.siteId, [{ tag: tag }])
      return tag
    }),
})
