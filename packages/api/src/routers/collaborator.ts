import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  PRO_PLAN_COLLABORATOR_LIMIT,
  TEAM_PLAN_COLLABORATOR_LIMIT,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { CollaboratorRole, PlanType, ProviderType } from '@penx/db/client'
import { cacheHelper } from '@penx/libs/cache-header'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const collaboratorRouter = router({
  listSiteCollaborators: protectedProcedure.query(async ({ ctx, input }) => {
    return prisma.collaborator.findMany({
      where: { siteId: ctx.activeSiteId },
      include: { user: { include: { accounts: true } } },
    })
  }),

  addCollaborator: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        q: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const admin = await prisma.collaborator.findFirstOrThrow({
        where: { userId: ctx.token.uid, siteId },
      })

      const ops: CollaboratorRole[] = [
        CollaboratorRole.OWNER,
        CollaboratorRole.ADMIN,
      ]

      if (!ops.includes(admin.role)) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'No permission to add collaborator',
        })
      }

      const count = await prisma.collaborator.count({
        where: { siteId: input.siteId },
      })

      if (ctx.isFree && count >= PRO_PLAN_COLLABORATOR_LIMIT) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have reached the pro plan collaborator limit.',
        })
      }

      const user = await prisma.user.findFirst({
        where: {
          email: input.q,
          accounts: {
            some: {
              OR: [
                // { email: input.q },
                { providerAccountId: input.q.toLowerCase() },
              ],
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User not found, please check the address or email',
        })
      }

      const collaborator = await prisma.collaborator.findFirst({
        where: { userId: user.id, siteId },
      })

      if (collaborator) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User is a contributor already!',
        })
      }

      await cacheHelper.updateMySites(user.id, null)

      return prisma.collaborator.create({
        data: {
          siteId,
          role: CollaboratorRole.WRITE,
          userId: user.id,
        },
      })
    }),

  updateCollaborator: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        collaboratorId: z.string(),
        role: z.nativeEnum(CollaboratorRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const admin = await prisma.collaborator.findFirstOrThrow({
        where: { userId: ctx.token.uid, siteId },
      })

      const ops: CollaboratorRole[] = [
        CollaboratorRole.OWNER,
        CollaboratorRole.ADMIN,
      ]

      if (!ops.includes(admin.role)) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'No permission to add collaborator',
        })
      }

      return prisma.collaborator.update({
        where: { id: input.collaboratorId },
        data: { role: input.role },
      })
    }),

  deleteCollaborator: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        collaboratorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      const admin = await prisma.collaborator.findFirstOrThrow({
        where: { userId: ctx.token.uid, siteId },
      })

      const ops: CollaboratorRole[] = [
        CollaboratorRole.OWNER,
        CollaboratorRole.ADMIN,
      ]

      if (!ops.includes(admin.role)) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'No permission to add collaborator',
        })
      }

      if (admin.id === input.collaboratorId) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Cannot delete yourself',
        })
      }

      const collaborator = await prisma.collaborator.delete({
        where: { id: input.collaboratorId },
      })

      await cacheHelper.updateMySites(collaborator.userId, null)
      return true
    }),
})
