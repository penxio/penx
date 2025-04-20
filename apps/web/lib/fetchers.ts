import { gql, request } from 'graphql-request'
import { produce } from 'immer'
import ky from 'ky'
import { unstable_cache } from 'next/cache'
import { getDatabaseData } from '@penx/api/lib/getDatabaseData'
import { initAboutPage, initPages } from '@penx/api/lib/initPages'
import { prisma } from '@penx/db'
import { ProductType } from '@prisma/client'
import { calculateSHA256FromString } from '@penx/encryption'
import {
  Creation,
  CreationType,
  Friend,
  NavLink,
  NavLinkLocation,
  NavLinkType,
  Project,
  Prop,
  Site,
} from '@penx/types'
import { cacheHelper } from './cache-header'
import {
  CreationStatus,
  defaultLayouts,
  defaultNavLinks,
  editorDefaultValue,
  FRIEND_DATABASE_NAME,
  isProd,
  PROJECT_DATABASE_NAME,
  RESPACE_BASE_URI,
  ROOT_DOMAIN,
  SUBGRAPH_URL,
} from './constants'
import { creationToFriend } from './creationToFriend'
import { SpaceType } from './types'
import { uniqueId } from './unique-id'
import { getUrl } from './utils'

const REVALIDATE_TIME = process.env.REVALIDATE_TIME
  ? Number(process.env.REVALIDATE_TIME)
  : 3600

export async function getSite(params: any) {
  let domain = decodeURIComponent(params.domain)

  const isSubdomain = domain.endsWith(`.${ROOT_DOMAIN}`)

  if (isSubdomain) {
    domain = domain.replace(`.${ROOT_DOMAIN}`, '')
  }

  return await unstable_cache(
    async () => {
      const domainRes = await prisma.domain.findUnique({
        where: { domain: domain, isSubdomain },
        select: { siteId: true, isSubdomain: true },
      })
      if (!domainRes) return null as any as Site

      const site = await prisma.site.findUniqueOrThrow({
        where: { id: domainRes.siteId },
        include: {
          user: true,
          channels: true,
          areas: true,
          molds: true,
          products: {
            where: {
              type: ProductType.TIER,
            },
          },
        },
      })

      function getAbout() {
        if (!site?.about) return editorDefaultValue
        try {
          return JSON.parse(site.about)
        } catch (error) {
          return editorDefaultValue
        }
      }
      const config = site.config as any as Site['config']

      const isNavLinkValid = ((site?.navLinks || []) as NavLink[])?.some(
        (i) => i.pathname === '/ama',
      )

      const themeConfig = (site.themeConfig || {}) as any
      const currentThemeConfig = themeConfig[site.themeName || 'sue'] || {
        layout: defaultLayouts,
        common: {},
        home: {},
      }

      const getNavLinks = () => {
        const navLinks = isNavLinkValid
          ? (site.navLinks as NavLink[])
          : defaultNavLinks
        return navLinks
      }

      return {
        ...site,
        // spaceId: site.spaceId || process.env.NEXT_PUBLIC_SPACE_ID,
        spaceId: process.env.NEXT_PUBLIC_SPACE_ID || site.spaceId,
        logo: getUrl(site.logo || ''),
        image: getUrl(site.image || ''),
        about: getAbout(),
        navLinks: getNavLinks(),
        seoTitle: config?.seo?.title || site?.name || '',
        seoDescription: config?.seo?.description || site?.description || '',
        theme: {
          ...currentThemeConfig,
        } as Site['theme'],
      } as any as Site
    },
    [`site-${domain}`],
    {
      // revalidate: isProd ? 3600 * 24 : 10,
      revalidate: REVALIDATE_TIME,
      tags: [`site-${domain}`],
    },
  )()
}

export async function getFirstSite() {
  return await unstable_cache(
    async () => {
      const site = await prisma.site.findFirst()
      return site!
    },
    [`first-site`],
    {
      // revalidate: isProd ? 3600 * 24 : 10,
      revalidate: REVALIDATE_TIME,
      tags: [`first-site`],
    },
  )()
}

export async function getCreations(site: Site) {
  const siteId = site.id
  const mold = site.molds.find((i) => i.type === CreationType.ARTICLE)!
  const creations = await unstable_cache(
    async () => {
      let creations = await findManyCreations(site, mold.id)
      return creations
    },
    [`${siteId}-creations`],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [`${siteId}-creations`],
    },
  )()

  return creations
}

export async function getPodcasts(site: Site) {
  const siteId = site.id
  const mold = site.molds.find((i) => i.type === CreationType.AUDIO)!
  const creations = await unstable_cache(
    async () => {
      let creations = await findManyCreations(site, mold.id)
      return creations
    },
    [`${siteId}-podcasts`],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [`${siteId}-podcasts`],
    },
  )()

  return creations
}

export async function getNotes(site: Site) {
  const siteId = site.id
  const mold = site.molds.find((i) => i.type === CreationType.NOTE)!
  const creations = await unstable_cache(
    async () => {
      let creations = await findManyCreations(site, mold.id)
      return creations
    },
    [`${siteId}-notes`],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [`${siteId}-notes`],
    },
  )()

  return creations
}

export async function getPhotos(site: Site) {
  const siteId = site.id
  const mold = site.molds.find((i) => i.type === CreationType.IMAGE)!
  const creations = await unstable_cache(
    async () => {
      let creations = await findManyCreations(site, mold.id)
      return creations
    },
    [`${siteId}-images`],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [`${siteId}-images`],
    },
  )()

  return creations
}

export async function getArea(siteId: string, slug: string) {
  const key = `${siteId}-area-${slug}`
  const area = await unstable_cache(
    async () => {
      const field = await prisma.area.findFirst({
        include: {
          creations: {
            where: {
              status: CreationStatus.PUBLISHED,
            },
            include: {
              authors: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        where: {
          siteId,
          slug,
        },
      })
      return field
    },
    [key],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [key],
    },
  )()

  return area
}

export async function getCreation(siteId: string, slug: string) {
  return await unstable_cache(
    async () => {
      const creation = await prisma.creation.findFirst({
        where: { slug, siteId },
        include: {
          creationTags: { include: { tag: true } },
          authors: {
            include: {
              user: {
                select: {
                  email: true,
                  name: true,
                  displayName: true,
                  image: true,
                  bio: true,
                },
              },
            },
          },
        },
      })

      if (!creation) return null

      return {
        ...creation,
        image: getUrl(creation.image || ''),
        authors: creation.authors.map((author) => ({
          ...author,
          user: {
            ...author.user,
            image: getUrl(author.user.image || ''),
          },
        })),
      } as any as Creation
    },
    [`${siteId}-creation-${slug}`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`${siteId}-creation-${slug}`],
    },
  )()
}

export async function getTags(siteId: string) {
  return await unstable_cache(
    async () => {
      return prisma.tag.findMany({
        where: { siteId },
      })
    },
    [`${siteId}-tags`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`${siteId}-tags`],
    },
  )()
}

export async function getTagWithCreation(siteId: string, name: string) {
  const key = `${siteId}-tags-${calculateSHA256FromString(name)}`
  return await unstable_cache(
    async () => {
      const tag = await prisma.tag.findFirstOrThrow({
        include: {
          creationTags: {
            where: {
              creation: {
                status: CreationStatus.PUBLISHED,
              },
            },
            include: {
              creation: {
                include: {
                  user: {
                    select: {
                      email: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: { name, siteId },
      })

      return produce(tag, (draft) => {
        draft.creationTags = draft.creationTags.map((creationTag) => {
          const creation = creationTag.creation
          let content = creation.content
          if (
            creation.type === CreationType.IMAGE ||
            creation.type === CreationType.VIDEO
          ) {
            content = getUrl(creation.content)
          }
          creationTag.creation.image = getUrl(creation.image || '')
          creationTag.creation.content = content
          return creationTag
        })
      })
    },
    [key],
    {
      revalidate: REVALIDATE_TIME,
      tags: [key],
    },
  )()
}

export async function getSpace(spaceId: string) {
  return await unstable_cache(
    async () => {
      const response = await ky
        .get(RESPACE_BASE_URI + `/api/get-space?address=${spaceId}`)
        .json<SpaceType>()

      return response
    },
    [`space-${spaceId}`],
    {
      // revalidate: isProd ? 3600 : 10,
      revalidate: 60,
      tags: [`space-${spaceId}`],
    },
  )()
}

const spaceIdsQuery = gql`
  {
    spaces(first: 1000) {
      id
    }
  }
`

export async function getSpaceIds() {
  return await unstable_cache(
    async () => {
      try {
        const { spaces = [] } = await request<{ spaces: SpaceType[] }>({
          url: SUBGRAPH_URL,
          document: spaceIdsQuery,
        })
        return spaces
      } catch (error) {
        return []
      }
    },
    ['space-ids'],
    {
      revalidate: 60 * 60 * 24 * 365,
      tags: ['space-ids'],
    },
  )()
}

export async function getPage(siteId = '', slug = '') {
  return await unstable_cache(
    async () => {
      const page = await prisma.creation.findUnique({
        where: {
          siteId_slug: {
            siteId: siteId || uniqueId(),
            slug: slug || uniqueId(),
          },
        },
      })

      if (!page) {
        try {
          const site = await prisma.site.findUniqueOrThrow({
            where: { id: siteId },
          })
          await initPages(siteId, site.userId)
          const page = await prisma.creation.findUnique({
            where: {
              siteId_slug: {
                siteId: siteId || uniqueId(),
                slug: slug || uniqueId(),
              },
            },
          })
          return page!
        } catch (error) {}
      }

      if (!page && slug === 'about') {
        const site = await prisma.site.findUniqueOrThrow({
          where: { id: siteId },
        })
        const page = await initAboutPage(siteId, site.userId)
        return page!
      }

      return page
    },
    [`${siteId}-page-${slug}`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`${siteId}-page-${slug}`],
    },
  )()
}

export async function getFriends(site: Site) {
  const siteId = site.id
  const mold = site.molds.find((mold) => mold.type === CreationType.FRIEND)
  return await unstable_cache(
    async () => {
      const creations = await findManyCreations(site, mold!.id)
      return creations.map((item) => {
        return creationToFriend(item)
      })
    },
    [`${siteId}-friends`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`${siteId}-friends`],
    },
  )()
}

export async function getProjects(site: Site) {
  const siteId = site.id
  const mold = site.molds.find((mold) => mold.type === CreationType.PROJECT)
  return await unstable_cache(
    async () => {
      const creations = await findManyCreations(site, mold!.id)
      return creations.map((item) => {
        const props = (item.mold?.props || []) as Prop[]
        const output = props.reduce(
          (acc, prop) => {
            return { ...acc, [prop.slug]: item.props?.[prop.id] }
          },
          {} as Record<string, any>,
        )
        return {
          id: item.id,
          name: item.title,
          introduction: item.description,
          ...output,
        } as Project
      })
    },
    [`${siteId}-projects`],
    {
      revalidate: REVALIDATE_TIME,
      tags: [`${siteId}-projects`],
    },
  )()
}

export async function getHomeSites() {
  return await unstable_cache(
    async () => {
      // const cachedSites = await cacheHelper.getCachedHomeSites()
      // if (cachedSites) return cachedSites
      const sites = await prisma.site.findMany({
        where: {
          creationCount: { gte: 2 },
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
    },
    ['home-sites'],
    {
      revalidate: REVALIDATE_TIME,
      tags: ['home-sites'],
    },
  )()
}

export async function getSiteCount() {
  return await unstable_cache(
    async () => {
      const count = await prisma.site.count({
        where: {
          creationCount: { gte: 2 },
        },
      })
      return count
    },
    ['site-count'],
    {
      revalidate: REVALIDATE_TIME,
      tags: ['site-count'],
    },
  )()
}

async function findManyCreations(site: Site, moldId: string) {
  const area = site.areas.find((item) => item.isGenesis)
  const creations = await prisma.creation.findMany({
    include: {
      creationTags: { include: { tag: true } },
      mold: true,
      authors: {
        include: {
          user: {
            select: {
              email: true,
              name: true,
              displayName: true,
              bio: true,
              image: true,
            },
          },
        },
      },
    },
    where: {
      siteId: site.id,
      // isPage: false,
      moldId,
      areaId: area?.id,
      status: CreationStatus.PUBLISHED,
    },
    orderBy: [{ publishedAt: 'desc' }],
  })

  return creations.map((item) => {
    let content = item.content
    if (item.type === CreationType.IMAGE || item.type === CreationType.VIDEO) {
      content = getUrl(item.content)
    }

    return {
      ...item,
      image: getUrl(item.image || ''),
      authors: item.authors.map((author) => ({
        ...author,
        user: {
          ...author.user,
          image: getUrl(author.user.image || ''),
        },
      })),
      content,
    } as any as Creation
  })
}

export async function getTiers(siteId: string) {
  const tiers = await unstable_cache(
    async () => {
      const tiers = await prisma.product.findMany({
        where: { siteId, type: ProductType.TIER },
      })

      return tiers
    },
    [`${siteId}-tiers`],
    {
      revalidate: isProd ? REVALIDATE_TIME : 10,
      tags: [`${siteId}-tiers`],
    },
  )()

  return tiers
}
