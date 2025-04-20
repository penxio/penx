import { prisma } from '@penx/db'
import { TransferMethod } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const payoutAccountRouter = router({
  byId: publicProcedure.input(z.string().uuid()).query(async ({ input }) => {
    const account = await prisma.payoutAccount.findFirst({
      where: { id: input },
    })
    if (!account) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Payout account not found',
      })
    }
    return account
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const products = await prisma.payoutAccount.findMany({
      where: { userId: ctx.token.uid },
    })
    return products
  }),

  create: protectedProcedure
    .input(
      z.object({
        transferMethod: z.nativeEnum(TransferMethod),
        info: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const payoutAccount = await prisma.payoutAccount.findFirst({
        where: {
          transferMethod: TransferMethod.WALLET,
          userId: ctx.token.uid,
        },
      })
      if (payoutAccount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A wallet payout account already exists',
        })
      }

      return await prisma.payoutAccount.create({
        data: {
          userId: ctx.token.uid,
          ...input,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        transferMethod: z.nativeEnum(TransferMethod),
        info: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      return await prisma.payoutAccount.update({
        where: { id },
        data: rest,
      })
    }),
})
