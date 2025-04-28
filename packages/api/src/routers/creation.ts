import {
  CollaboratorRole,
  Creation,
  CreationStatus,
  GateType,
} from '@penx/db/client'
import { TRPCError } from '@trpc/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getPostEmailTpl } from '@penx/api/lib/getPostEmailTpl'
import {
  revalidateCreation,
  revalidateCreationTags,
} from '@penx/api/lib/revalidateCreation'
import {
  BUILTIN_PAGE_SLUGS,
  createCreationInputSchema,
  updateCreationInputSchema,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { cacheHelper } from '@penx/libs/cache-header'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { renderSlateToHtml } from '@penx/libs/slate-to-html'
import { CreationById, CreationType, SiteCreation } from '@penx/types'
import { getUrl } from '@penx/utils'
import { createCreation } from '../lib/createCreation'
import { createNewsletterWithDelivery } from '../lib/createNewsletterWithDelivery'
import { findCreations } from '../lib/findCreations'
import { findNotes } from '../lib/findNotes'
import { findPublishedCreations } from '../lib/findPublishedCreations'
import { getCreation } from '../lib/getCreation'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const creationRouter = router({
  listAllCreations: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input
      let creations = await findCreations({ siteId })
      const siteCreations = creations.map((creation) => ({
        ...creation,
        image: getUrl(creation.image || ''),
      }))
      return siteCreations as SiteCreation[]
    }),

  listSiteCreations: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input
      return prisma.creation.findMany({
        where: { siteId },
      })
    }),

  listCreationsBySite: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input

      let creations = await findCreations({
        siteId,
      })

      const siteCreations = creations.map((creation) => ({
        ...creation,
        image: getUrl(creation.image || ''),
      }))

      return siteCreations as SiteCreation[]
    }),

  listNotes: protectedProcedure
    .input(
      z.object({
        moldId: z.string(),
        areaId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { moldId, areaId } = input
      const cachedNotes = await cacheHelper.getNotes(areaId)
      if (cachedNotes) return cachedNotes
      let notes = await findNotes({ moldId, areaId })

      await cacheHelper.updateNotes(areaId, notes)
      return notes as Creation[]
    }),

  listCreationsByMold: protectedProcedure
    .input(
      z.object({
        moldId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const siteId = ctx.activeSiteId
      const { moldId } = input
      const cachedCreations = await cacheHelper.getMoldCreation(siteId, moldId)
      if (cachedCreations) return cachedCreations

      let creations = await findCreations({
        siteId,
        moldId: input.moldId,
      })

      await cacheHelper.updateMoldCreations(siteId, moldId, creations)

      return creations as SiteCreation[]
    }),

  listCreationsByArea: protectedProcedure
    .input(
      z.object({
        areaId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { areaId } = input
      const cachedCreations = await cacheHelper.getAreaCreations(areaId)
      if (cachedCreations) return cachedCreations

      let creations = await findCreations({ areaId })
      await cacheHelper.updateAreaCreations(areaId, creations)

      return creations as SiteCreation[]
    }),

  listProjects: protectedProcedure
    .input(
      z.object({
        siteId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const siteId = input.siteId || ctx.activeSiteId
      const mold = await prisma.mold.findFirstOrThrow({
        where: {
          siteId,
          type: CreationType.PROJECT,
        },
      })
      let creations = await findCreations({
        siteId,
        moldId: mold.id,
      })

      const projects = creations.map((item) => ({
        ...item,
        image: getUrl(item.image || ''),
      }))

      await cacheHelper.updateMoldCreations(siteId, mold.id, creations)
      return projects as SiteCreation[]
    }),

  listAllSiteCreations: protectedProcedure.query(async ({ ctx, input }) => {
    return await prisma.creation.findMany({
      where: {
        title: {
          notIn: ['Welcome to PenX!', ''],
        },
        siteId: {
          notIn: ['cc79cefe-0cf8-4cd7-9970-66740024b618'],
        },
        isPage: false,
        status: CreationStatus.PUBLISHED,
      },
      include: {
        site: {
          include: { domains: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1000,
    })
  }),

  archivedCreations: protectedProcedure.query(async ({ ctx, input }) => {
    return await prisma.creation.findMany({
      where: {
        siteId: ctx.activeSiteId,
        status: CreationStatus.ARCHIVED,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),

  publishedCreations: publicProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { siteId } = input
      let creations = await findPublishedCreations(siteId)

      return creations.map((item) => ({
        ...item,
        image: getUrl(item.image || ''),
      }))
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const cachedCreation = await cacheHelper.getCreation(input)
    if (cachedCreation) return cachedCreation
    const creation = await getCreation(input)
    await cacheHelper.updateCreation(creation.id, creation)
    // syncToGoogleDrive(ctx.token.uid, post as any)
    // console.log('post-------xxxxxxxxxx:', post?.creationTags)
    return creation
  }),

  bySlug: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const creation = await prisma.creation.findFirstOrThrow({
      where: { slug: input, siteId: ctx.activeSiteId },
      include: {
        mold: true,
        authors: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                displayName: true,
                ensName: true,
              },
            },
          },
        },
      },
    })
    return creation
  }),

  create: protectedProcedure
    .input(createCreationInputSchema)
    .mutation(async ({ ctx, input }) => {
      return createCreation(ctx.activeSiteId, ctx.token.uid, ctx.isFree, input)
    }),

  update: protectedProcedure
    .input(updateCreationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      let creation = await prisma.creation.update({
        where: { id },
        data,
      })

      const newCreation = await cacheHelper.updateCreationProps(id, {
        ...creation,
      })

      if (creation) {
        let creations = await findCreations({ areaId: creation.areaId! })
        await cacheHelper.updateAreaCreations(creation.areaId!, creations)

        if (creation.type === CreationType.NOTE) {
          let notes = await findNotes({
            moldId: creation.moldId!,
            areaId: creation.areaId!,
          })
          await cacheHelper.updateNotes(creation.areaId!, notes)
        }
      }

      await cacheHelper.updateMoldCreations(
        creation.siteId,
        creation.moldId!,
        null,
      )
      return newCreation
    }),

  publish: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        creationId: z.string(),
        slug: z.string(),
        gateType: z.nativeEnum(GateType).optional(),
        collectible: z.boolean().optional(),
        delivered: z.boolean().optional(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid

      if (input.delivered && ctx.isFree) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Newsletters features is not supported on Free plan',
        })
      }

      let creation = await prisma.creation.findUniqueOrThrow({
        where: { id: input.creationId },
        include: {
          mold: true,
          creationTags: { include: { tag: true } },
        },
      })

      if (
        BUILTIN_PAGE_SLUGS.includes(creation.slug) &&
        creation.slug !== input.slug
      ) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'You can not update builtin page slug.',
        })
      }

      let shouldCreateNewsletter = false

      const wasDelivered = creation.delivered

      shouldCreateNewsletter = input.delivered! && !wasDelivered

      if (shouldCreateNewsletter) {
        const site = await prisma.site.findUniqueOrThrow({
          where: { id: input.siteId },
          include: { domains: true },
        })
        const domain = getSiteDomain(site.domains) || site.domains[0]

        await createNewsletterWithDelivery({
          siteId: input.siteId,
          creationId: creation.id,
          title: creation.title || '',
          // content: renderSlateToHtml(JSON.parse(info.content)),
          content: getPostEmailTpl(
            creation.title || '',
            renderSlateToHtml(JSON.parse(creation.content)),
            `https://${domain.domain}.penx.io/creations/${creation.slug}`,
            creation.image ? getUrl(creation.image) : '',
          ),
          creatorId: ctx.token.uid,
        })
      }

      creation = await prisma.creation.update({
        where: { id: creation.id },
        data: {
          slug: input.slug,
          status: CreationStatus.PUBLISHED,
          gateType: input.gateType,
          // cid: res.cid,
          collectible: input.collectible,
          delivered: wasDelivered ? wasDelivered : input.delivered,
          publishedAt: input.publishedAt || creation.publishedAt || new Date(),
        },
        include: {
          mold: true,
          creationTags: { include: { tag: true } },
        },
      })

      const publishedCount = await prisma.creation.count({
        where: { siteId: input.siteId, status: CreationStatus.PUBLISHED },
      })

      const site = await prisma.site.update({
        where: { id: input.siteId },
        data: { creationCount: publishedCount },
      })

      if (creation) {
        let creations = await findCreations({ areaId: creation.areaId! })
        await cacheHelper.updateAreaCreations(creation.areaId!, creations)
      }

      if (creation.type === CreationType.NOTE) {
        let notes = await findNotes({
          moldId: creation.moldId!,
          areaId: creation.areaId!,
        })
        await cacheHelper.updateNotes(creation.areaId!, notes)
      }

      await cacheHelper.updateCreationProps(creation.id, creation)

      await cacheHelper.updateMoldCreations(
        creation.siteId,
        creation.moldId!,
        null,
      )

      if (creation.areaId) {
        const { slug: fieldSlug } = await prisma.area.findUniqueOrThrow({
          where: { id: creation.areaId },
          select: { slug: true },
        })
        revalidateTag(`${creation.siteId}-area-${fieldSlug}`)
      }

      revalidateTag(`${creation.siteId}-creations`)
      revalidateTag(`${creation.siteId}-creation-${creation.slug}`)
      revalidatePath(`/creations/${creation.slug}`)

      revalidateCreation(creation)
      revalidateCreationTags(input.siteId, creation.creationTags)

      return creation
    }),

  unpublish: protectedProcedure
    .input(
      z.object({
        creationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const creation = await prisma.creation.update({
        where: { id: input.creationId },
        data: {
          status: CreationStatus.DRAFT,
          publishedAt: null,
        },
      })

      const newPost = await prisma.creation.findUnique({
        include: {
          creationTags: { include: { tag: true } },
        },
        where: { id: creation.id },
      })

      await cacheHelper.updateCreationProps(creation.id, {
        ...creation,
      })
      await cacheHelper.updateMoldCreations(
        creation.siteId,
        creation.moldId!,
        null,
      )

      revalidateTag(`${creation.siteId}-creations`)
      revalidateTag(`${creation.siteId}-creation-${creation.slug}`)
      revalidatePath(`/creation/${creation.slug}`)
      revalidateCreation(creation)
      revalidateCreationTags(creation.siteId, newPost?.creationTags)
    }),

  updatePublishedPost: protectedProcedure
    .input(
      z.object({
        creationId: z.string(),
        featured: z.boolean().optional(),
        isPopular: z.boolean().optional(),
        publishedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { creationId, ...data } = input
      const creation = await prisma.creation.update({
        where: { id: creationId },
        data,
        include: {
          creationTags: { include: { tag: true } },
        },
      })

      await cacheHelper.updateCreationProps(creation.id, creation)
      await cacheHelper.updateMoldCreations(
        creation.siteId,
        creation.moldId!,
        null,
      )

      if (creation) {
        let creations = await findCreations({ areaId: creation.areaId! })
        await cacheHelper.updateAreaCreations(creation.areaId!, creations)
      }

      if (creation.type === CreationType.NOTE) {
        let notes = await findNotes({
          moldId: creation.moldId!,
          areaId: creation.areaId!,
        })
        await cacheHelper.updateNotes(creation.areaId!, notes)
      }

      revalidateTag(`${creation.siteId}-creations`)
      revalidateTag(`${creation.siteId}-creations-${creation.slug}`)
      revalidatePath(`/creations/${creation.slug}`)
      revalidateCreationTags(creation.siteId, creation.creationTags)

      return creation
    }),

  importPosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        creations: z.array(z.any()),
        creationStatus: z.nativeEnum(CreationStatus).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const siteId = input.siteId

      return prisma.$transaction(
        async (tx) => {
          const molds = await tx.mold.findMany({
            where: {
              siteId: input.siteId,
            },
          })

          const newPosts = await tx.creation.createManyAndReturn({
            data: input.creations.map((p: Creation) => {
              const mold = molds.find((m) => m.type === p.type) || molds[0]
              return {
                moldId: mold.id,
                type: mold.type,
                siteId,
                userId: ctx.token.uid,
                title: p.title,
                content: p.content,
                status: Reflect.has(input, 'creationStatus')
                  ? input.creationStatus
                  : p.status,
                image: p.image,
              }
            }),
          })

          const ids = newPosts.map((i) => i.id)

          await tx.author.createMany({
            data: ids.map((creationId) => ({
              siteId,
              userId: ctx.token.uid,
              creationId,
            })),
          })

          const creationCount = await tx.creation.count({
            where: {
              siteId,
              status: CreationStatus.PUBLISHED,
            },
          })

          await tx.site.update({
            where: { id: siteId },
            data: { creationCount },
          })

          for (const mold of molds) {
            await cacheHelper.updateMoldCreations(siteId, mold.id, null)
          }

          revalidateTag(`${siteId}-creations`)
          return true
        },
        {
          maxWait: 10000, // default: 2000
          timeout: 20000, // default: 5000
        },
      )
    }),

  archive: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const creation = await prisma.creation.update({
        where: { id: input },
        data: { status: CreationStatus.ARCHIVED },
      })

      await cacheHelper.updateCreation(creation.id, null)
      await cacheHelper.updateMoldCreations(
        creation.siteId,
        creation.moldId!,
        null,
      )

      if (creation) {
        let creations = await findCreations({ areaId: creation.areaId! })
        await cacheHelper.updateAreaCreations(creation.areaId!, creations)
      }

      if (creation.type === CreationType.NOTE) {
        let notes = await findNotes({
          moldId: creation.moldId!,
          areaId: creation.areaId!,
        })
        await cacheHelper.updateNotes(creation.areaId!, notes)
      }

      revalidateTag(`${creation.siteId}-creations`)
      revalidateTag(`creations-${creation.slug}`)
      revalidatePath(`/creations/${creation.slug}`)

      return creation
    }),

  restore: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return prisma.$transaction(async (tx) => {
        const creation = await tx.creation.findUniqueOrThrow({
          where: { id },
        })

        await tx.creation.update({
          where: { id: id },
          data: { status: CreationStatus.DRAFT },
        })

        await cacheHelper.updateCreation(creation.id, null)
        await cacheHelper.updateMoldCreations(
          creation.siteId,
          creation.moldId!,
          null,
        )

        if (creation) {
          let creations = await findCreations({ areaId: creation.areaId! })
          await cacheHelper.updateAreaCreations(creation.areaId!, creations)
        }

        if (creation.type === CreationType.NOTE) {
          let notes = await findNotes({
            moldId: creation.moldId!,
            areaId: creation.areaId!,
          })
          await cacheHelper.updateNotes(creation.areaId!, notes)
        }

        return creation
      })
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return prisma.$transaction(async (tx) => {
        const creation = await tx.creation.findUniqueOrThrow({
          where: { id },
          include: { mold: true },
        })

        if (BUILTIN_PAGE_SLUGS.includes(creation.slug)) {
          throw new TRPCError({
            code: 'BAD_GATEWAY',
            message: 'You can not delete builtin page.',
          })
        }

        await tx.author.deleteMany({ where: { creationId: id } })
        await tx.creationTag.deleteMany({ where: { creationId: id } })
        await tx.newsletter.deleteMany({ where: { creationId: id } })
        await tx.comment.deleteMany({ where: { creationId: id } })
        await tx.creation.delete({
          where: { id: id },
        })
        await cacheHelper.updateCreation(creation.id, null)
        await cacheHelper.updateMoldCreations(
          creation.siteId,
          creation.moldId!,
          null,
        )

        if (creation) {
          let creations = await findCreations({ areaId: creation.areaId! })
          await cacheHelper.updateAreaCreations(creation.areaId!, creations)
        }

        if (creation.type === CreationType.NOTE) {
          let notes = await findNotes({
            moldId: creation.moldId!,
            areaId: creation.areaId!,
          })
          await cacheHelper.updateNotes(creation.areaId!, notes)
        }

        revalidateCreation(creation)

        return creation
      })
    }),

  deleteSitePosts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collaborator = await prisma.collaborator.findFirst({
        where: { userId: ctx.token.uid, siteId: input.siteId },
      })

      if (collaborator?.role !== CollaboratorRole.OWNER) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only owner can delete all creations in a site',
        })
      }

      return prisma.$transaction(async (tx) => {
        const { siteId } = input
        await tx.comment.deleteMany({ where: { siteId } })
        await tx.creationTag.deleteMany({ where: { siteId } })
        await tx.author.deleteMany({ where: { siteId } })
        await tx.creation.deleteMany({
          where: { siteId },
        })

        await tx.site.update({
          where: { id: siteId },
          data: { creationCount: 0 },
        })

        const molds = await prisma.mold.findMany({ where: { siteId } })

        for (const mold of molds) {
          await cacheHelper.updateMoldCreations(input.siteId, mold.id, null)
        }

        return true
      })
    }),

  addAuthor: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        creationId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const author = await prisma.author.create({
        // TODO:
        data: {
          siteId: ctx.activeSiteId,
          ...input,
        } as any,
        include: {
          user: {
            select: {
              name: true,
              image: true,
              displayName: true,
              ensName: true,
            },
          },
        },
      })

      await cacheHelper.updateCreation(input.creationId, null)
      return author
    }),

  deleteAuthor: protectedProcedure
    .input(
      z.object({
        creationId: z.string(),
        authorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.author.delete({
        where: { id: input.authorId },
      })

      const authors = await prisma.author.findMany({
        where: { creationId: input.creationId },
        include: {
          user: {
            select: {
              name: true,
              image: true,
              displayName: true,
              ensName: true,
            },
          },
        },
      })
      await cacheHelper.updateCreationProps(input.creationId, {
        authors,
      } as any)
      return true
    }),
})
