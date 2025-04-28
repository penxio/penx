import { ProductType, StripeType, SubdomainType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import {
  defaultBenefits,
  isProd,
  reservedDomains,
  TierInterval,
} from '@penx/constants'
import { prisma } from '@penx/db'
import { cacheHelper } from '@penx/libs/cache-header'
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
} from '@penx/libs/domains'
import { revalidateSite } from '@penx/libs/revalidateSite'
import { stripe } from '@penx/libs/stripe'
import { MySite, StripeInfo } from '@penx/types'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const siteRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.site.findMany({
      include: {
        domains: true,
        channels: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })
  }),

  listWithPagination: publicProcedure
    .input(
      z.object({
        pageNum: z.number().optional().default(1),
        pageSize: z.number().optional().default(100),
      }),
    )
    .query(async ({ input }) => {
      const { pageNum, pageSize } = input
      const offset = (pageNum - 1) * pageSize
      const list = await prisma.site.findMany({
        where: {
          creationCount: { gte: 2 },
        },
        include: {
          domains: true,
          channels: true,
        },
        orderBy: { createdAt: 'asc' },
        take: pageSize,
        skip: offset,
      })

      return {
        sites: list,
        count: await prisma.site.count({
          where: {
            creationCount: { gte: 2 },
          },
        }),
      }
    }),

  homeSites: publicProcedure.query(async ({ input }) => {
    const cachedSites = await cacheHelper.getHomeSites()
    if (cachedSites) return cachedSites
    const sites = await prisma.site.findMany({
      where: {
        creationCount: { gte: isProd ? 2 : 0 },
      },
      include: {
        domains: true,
        channels: true,
        areas: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 36,
    })

    await cacheHelper.updateHomeSites(sites)
    return sites
  }),

  mySites: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.token.uid
    const cachedMySites = await cacheHelper.getMySites(userId)
    if (Array.isArray(cachedMySites) && cachedMySites.length) {
      return cachedMySites
    }

    const collaborators = await prisma.collaborator.findMany({
      where: { userId },
    })

    const sites = await prisma.site.findMany({
      where: {
        id: {
          in: [...collaborators.map((c) => c.siteId)],
        },
      },
      include: {
        tags: true,
        domains: true,
        channels: true,
        areas: {
          where: {
            deletedAt: null,
          },
        },
        molds: true,
        products: {
          where: {
            type: ProductType.TIER,
          },
        },
      },
    })

    await cacheHelper.updateMySites(userId, sites)
    return sites as MySite[]
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // const cachedSite = await cacheHelper.getCachedSite(input.id)
      // if (cachedSite) return cachedSite
      const site = await prisma.site.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          tags: true,
          domains: true,
          channels: true,
          areas: {
            where: {
              deletedAt: null,
            },
          },
          molds: true,
        },
      })

      // await cacheHelper.updateCachedSite(site.id, site)
      return site
    }),

  listSiteSubdomains: protectedProcedure
    .input(z.object({ siteId: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.domain.findMany({
        where: { siteId: input.siteId, isSubdomain: true },
      })
    }),

  mySite: protectedProcedure.query(async ({ ctx, input }) => {
    const site = await prisma.site.findUniqueOrThrow({
      where: { id: ctx.token.activeSiteId },
    })

    return site
  }),

  bySubdomain: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { siteId } = await prisma.domain.findUniqueOrThrow({
        where: { domain: input },
        select: { siteId: true },
      })
      const site = await prisma.site.findUnique({
        where: { id: siteId },
        include: { domains: true },
      })

      if (site) return site

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: ctx.token.uid },
        include: {
          sites: { select: { id: true } },
        },
      })

      return prisma.site.findUniqueOrThrow({
        where: { id: user.sites[0]?.id },
        include: { domains: true },
      })
    }),

  updateSite: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        logo: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        about: z.string().optional(),
        themeName: z.string().optional(),
        themeConfig: z.record(z.any()).optional(),
        config: z.record(z.any()).optional(),
        spaceId: z.string().optional(),
        navLinks: z
          .array(
            z.object({
              title: z.string().optional(),
              pathname: z.string().optional(),
              type: z.string().optional(),
              location: z.string().optional(),
              visible: z.boolean().optional(),
            }),
          )
          .optional(),
        socials: z
          .object({
            farcaster: z.string().optional(),
            x: z.string().optional(),
            mastodon: z.string().optional(),
            github: z.string().optional(),
            facebook: z.string().optional(),
            youtube: z.string().optional(),
            linkedin: z.string().optional(),
            threads: z.string().optional(),
            instagram: z.string().optional(),
            discord: z.string().optional(),
            medium: z.string().optional(),
            slack: z.string().optional(),
            telegram: z.string().optional(),
            bilibili: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),
        analytics: z
          .object({
            gaMeasurementId: z.string().optional(),
            umamiHost: z.string().optional(),
            umamiWebsiteId: z.string().optional(),
          })
          .optional(),
        // catalogue: z.record(z.unknown()).optional(),
        catalogue: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      if (data.catalogue) {
        data.catalogue = JSON.parse(data.catalogue)
      }
      const newSite = await prisma.site.update({
        where: { id },
        include: { domains: true },
        data,
      })

      // try {
      //   await syncSiteToHub(newSite)
      // } catch (error) {}

      const collaborators = await prisma.collaborator.findMany({
        where: { siteId: id },
      })
      for (const item of collaborators) {
        await cacheHelper.updateMySites(item.userId, null)
      }

      revalidateSite(newSite.domains)

      await cacheHelper.updateHomeSites(null)
      return newSite
    }),

  enableFeatures: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        journal: z.boolean(),
        gallery: z.boolean(),
        page: z.boolean(),
        database: z.boolean(),
        contribute: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId, ...features } = input

      let site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
        include: { domains: true },
      })
      site = await prisma.site.update({
        where: { id: siteId },
        data: {
          config: {
            ...(site.config as any),
            features,
          },
        },
        include: { domains: true },
      })

      revalidateSite(site.domains)
      await cacheHelper.updateMySites(ctx.token.uid, null)
      await cacheHelper.updateHomeSites(null)

      return site
    }),

  updateLocalesConfig: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        locales: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId, locales } = input

      let site = await prisma.site.findUniqueOrThrow({
        where: { id: siteId },
        include: { domains: true },
      })

      site = await prisma.site.update({
        where: { id: siteId },
        data: {
          config: {
            ...(site.config as any),
            locales,
          },
        },
        include: { domains: true },
      })

      revalidateSite(site.domains)
      await cacheHelper.updateMySites(ctx.token.uid, null)
      await cacheHelper.updateHomeSites(null)

      return site
    }),

  listSiteDomains: protectedProcedure.query(async ({ ctx }) => {
    return prisma.domain.findMany({
      where: { siteId: ctx.token.activeSiteId },
    })
  }),

  addSubdomain: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domain: z.string().min(2, {
          message: 'Subdomain should be at least 2 characters long.',
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input
      if (reservedDomains.includes(input.domain)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `"${input.domain}" is reserved and cannot be used.`,
        })
      }

      if (input.domain.length < 6 && ctx.isFree) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'You are in free plan, subdomain should be at least 6 characters long, you can upgrade to pro to get short subdomain',
        })
      }

      const customSubdomainCount = await prisma.domain.count({
        where: {
          siteId,
          isSubdomain: true,
          subdomainType: SubdomainType.Custom,
        },
      })

      if (customSubdomainCount > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A custom subdomain already exists for this site.',
        })
      }

      const newDomain = await prisma.domain.create({
        data: {
          domain: input.domain,
          isSubdomain: true,
          subdomainType: SubdomainType.Custom,
          siteId,
        },
      })

      const domains = await prisma.domain.findMany({
        where: { siteId: siteId },
      })
      revalidateSite(domains)

      await cacheHelper.updateMySites(ctx.token.uid, null)
      await cacheHelper.updateHomeSites(null)
      return newDomain
    }),

  deleteSubdomain: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domainId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.domain.delete({
        where: { id: input.domainId },
      })

      const domains = await prisma.domain.findMany({
        where: { siteId: input.siteId },
      })
      revalidateSite(domains)
      await cacheHelper.updateMySites(ctx.token.uid, null)
      await cacheHelper.updateHomeSites(null)
      return true
    }),

  customDomain: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { siteId } = input

      const customDomain = await prisma.domain.findFirst({
        where: {
          isSubdomain: false,
          siteId: input.siteId,
        },
      })

      if (customDomain) {
        try {
          await removeDomainFromVercelProject(input.domain)
        } catch (error) {}
        const res = await addDomainToVercel(input.domain)

        await prisma.domain.update({
          where: { id: customDomain.id },
          data: { domain: input.domain },
        })

        const domains = await prisma.domain.findMany({
          where: { siteId: siteId },
        })
        revalidateSite(domains)
        return
      }

      try {
        await prisma.domain.create({
          data: {
            domain: input.domain,
            isSubdomain: false,
            siteId,
          },
        })

        const res = await addDomainToVercel(input.domain)

        const domains = await prisma.domain.findMany({
          where: { siteId: siteId },
        })
        revalidateSite(domains)
        await cacheHelper.updateMySites(ctx.token.uid, null)
        await cacheHelper.updateHomeSites(null)
        return res
      } catch (error) {
        console.log('===error:', error)

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Domain is already taken',
        })
      }
    }),

  deleteDomain: protectedProcedure
    .input(
      z.object({
        domain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customDomain = await prisma.domain.findFirstOrThrow({
        where: {
          isSubdomain: false,
          domain: input.domain,
        },
      })

      try {
        const res = await removeDomainFromVercelProject(customDomain.domain)
        await prisma.domain.delete({ where: { id: customDomain.id } })

        const domains = await prisma.domain.findMany({
          where: { siteId: customDomain.siteId },
        })
        revalidateSite(domains)
        await cacheHelper.updateMySites(ctx.token.uid, null)
        await cacheHelper.updateHomeSites(null)
        return res
      } catch (error) {
        console.log('===error:', error)

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to delete domain',
        })
      }
    }),

  selectStripeType: protectedProcedure
    .input(
      z.object({
        stripeType: z.nativeEnum(StripeType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.token.uid
      return prisma.$transaction(
        async (tx) => {
          await tx.site.update({
            where: { id: ctx.activeSiteId },
            data: { stripeType: input.stripeType },
          })

          if (input.stripeType === StripeType.PLATFORM) {
            const tier = await tx.product.findFirst({
              where: {
                siteId: ctx.activeSiteId,
                type: ProductType.TIER,
              },
            })

            if (!tier) {
              const product = await stripe.products.create({
                name: 'Member',
                description: 'Become a member',
                tax_code: 'txcd_10103000',
              })

              const price = 1000

              const monthlyPrice = await stripe.prices.create({
                unit_amount: price, // $10
                currency: 'usd',
                recurring: { interval: 'month' },
                product: product.id,
              })
              await tx.product.create({
                data: {
                  name: 'Member',
                  price: price,
                  type: ProductType.TIER,
                  stripe: {
                    productId: product.id,
                    priceId: monthlyPrice.id,
                    interval: TierInterval.MONTHLY,
                  } as StripeInfo,
                  description: JSON.stringify(defaultBenefits),
                  siteId: ctx.activeSiteId,
                  userId: ctx.token.uid,
                },
              })
            }
          }

          revalidateTag(`${ctx.activeSiteId}-tiers`)
          await cacheHelper.updateMySites(ctx.token.uid, null)
          await cacheHelper.updateHomeSites(null)
        },
        {
          maxWait: 5000, // default: 2000
          timeout: 10000, // default: 5000
        },
      )
    }),

  deleteSite: protectedProcedure.mutation(async ({ ctx, input }) => {
    const userId = ctx.token.uid
    return prisma.$transaction(
      async (tx) => {
        const site = await tx.site.findFirst({ where: { userId } })

        if (site?.userId !== ctx.token.uid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'No permission to delete site',
          })
        }

        const siteId = site?.id

        await tx.message.deleteMany({ where: { siteId } })
        await tx.channel.deleteMany({ where: { siteId } })
        await tx.author.deleteMany({ where: { siteId } })
        await tx.comment.deleteMany({ where: { siteId } })
        await tx.creationTag.deleteMany({ where: { siteId } })
        await tx.tag.deleteMany({ where: { siteId } })
        await tx.collaborator.deleteMany({ where: { siteId } })
        await tx.domain.deleteMany({ where: { siteId } })
        await tx.accessToken.deleteMany({ where: { siteId } })
        await tx.assetLabel.deleteMany({ where: { siteId } })
        await tx.label.deleteMany({ where: { siteId } })
        await tx.assetAlbum.deleteMany({ where: { siteId } })
        await tx.album.deleteMany({ where: { siteId } })

        await tx.asset.deleteMany({ where: { siteId } })
        await tx.record.deleteMany({ where: { siteId } })
        await tx.column.deleteMany({ where: { siteId } })
        await tx.view.deleteMany({ where: { siteId } })
        await tx.database.deleteMany({ where: { siteId } })
        await tx.subscriber.deleteMany({ where: { siteId } })
        await tx.delivery.deleteMany({ where: { siteId } })
        await tx.newsletter.deleteMany({ where: { siteId } })
        await tx.invoice.deleteMany({ where: { siteId } })
        await tx.order.deleteMany({ where: { siteId } })
        await tx.subscription.deleteMany({ where: { siteId } })
        await tx.product.deleteMany({ where: { siteId } })
        await tx.pledge.deleteMany({ where: { siteId } })
        await tx.campaign.deleteMany({ where: { siteId } })
        await tx.creation.deleteMany({ where: { siteId } })
        await tx.area.deleteMany({ where: { siteId } })
        await tx.subscription.deleteMany({ where: { siteId } })
        await tx.payout.deleteMany({ where: { siteId } })
        await tx.mold.deleteMany({ where: { siteId } })
        await tx.siteUser.deleteMany({ where: { siteId } })
        await tx.site.delete({ where: { id: siteId } })
        await tx.hostedSite.deleteMany({ where: { userId } })
        await tx.referral.deleteMany({ where: { userId } })
        await tx.account.deleteMany({ where: { userId } })
        await tx.user.delete({ where: { id: userId } })

        await cacheHelper.updateMySites(ctx.token.uid, null)
        await cacheHelper.updateHomeSites(null)
        return true
      },
      {
        maxWait: 10000, // default: 2000
        timeout: 20000, // default: 5000
      },
    )
  }),
})
