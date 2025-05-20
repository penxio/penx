import { TRPCError } from '@trpc/server'
import { slug } from 'github-slugger'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import {
  editorDefaultValue,
  FREE_PLAN_PAGE_LIMIT,
  FRIEND_DATABASE_NAME,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { Creation, CreationStatus } from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'
import { StructType, Option } from '@penx/types'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const pageRouter = router({
  submitFriendLink: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        data: z.object({
          name: z.string().min(1, { message: 'Name is required' }),
          introduction: z.string().min(5, { message: 'Name is required' }),
          avatar: z.string(),
          url: z.string().url(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      const siteId = input.siteId
      const struct = await prisma.struct.findFirstOrThrow({
        where: {
          siteId,
          type: StructType.FRIEND,
        },
      })

      const creation = await prisma.creation.create({
        data: {
          siteId: input.siteId,
          userId,
          title: input.data.name,
          description: input.data.introduction,
          structId: struct.id,
          type: struct.type,
          props: [],
          status: CreationStatus.PUBLISHED,
          publishedAt: new Date(),
          content: JSON.stringify(editorDefaultValue),
          i18n: {},
          updatedAt: new Date(),
          authors: {
            create: [
              {
                siteId: input.siteId,
                userId,
              },
            ],
          },
        },
      })

      revalidateTag(`${input.siteId}-friends`)

      return creation
    }),
})
