import { Post } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

enum PostType {
  ARTICLE = 'ARTICLE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  NFT = 'NFT',
  FIGMA = 'FIGMA',
}

enum GateType {
  FREE = 'FREE',
  MEMBER_ONLY = 'MEMBER_ONLY',
}

export const postRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return [] as Post[]
  }),

  listBySpaceId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return [] as Post[]
    }),

  publishedPosts: publicProcedure.input(z.string()).query(async ({ input }) => {
    return [] as Post[]
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return {} as Post & {
      space: {
        subdomain: string
        userId: string
      }
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        type: z.enum([
          PostType.ARTICLE,
          PostType.IMAGE,
          PostType.VIDEO,
          PostType.AUDIO,
          PostType.NFT,
          PostType.FIGMA,
        ]),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as Post & {
        space: {
          subdomain: string
          userId: string
        }
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  updateCover: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        gateType: z.enum([GateType.FREE, GateType.MEMBER_ONLY]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
