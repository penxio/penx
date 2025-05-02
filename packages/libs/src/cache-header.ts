import { produce } from 'immer'
import Redis from 'ioredis'
import { redisKeys } from '@penx/constants'
import { Creation } from '@penx/db/client'
import { AreaById, MySite, SiteCreation } from '@penx/types'

const redis = new Redis(process.env.REDIS_URL!)

export const cacheHelper = {
  async getSite(siteId: string): Promise<MySite | undefined> {
    const key = redisKeys.site(siteId)
    try {
      const str = await redis.get(key)
      if (str) {
        const site = JSON.parse(str)
        const siteById = site as MySite
        return produce(siteById, (draft) => {
          draft.createdAt = new Date(draft.createdAt)
          draft.updatedAt = new Date(draft.updatedAt)
        })
      }
    } catch (error) {}
  },

  async updateSite(siteId: string, site: MySite | null) {
    const key = redisKeys.site(siteId)
    if (!site) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(site), 'EX', 60 * 60 * 24)
    }
  },

  async getMySites(userId: string): Promise<MySite[] | undefined> {
    const key = redisKeys.mySites(userId)
    try {
      const str = await redis.get(key)
      if (str) {
        const sites = JSON.parse(str)
        if (Array.isArray(sites)) {
          const mySites = sites as MySite[]
          return produce(mySites, (draft) => {
            for (const site of draft) {
              site.createdAt = new Date(site.createdAt)
              site.updatedAt = new Date(site.updatedAt)
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateMySites(userId: string, sites: MySite[] | null) {
    const key = redisKeys.mySites(userId)
    if (!sites) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(sites), 'EX', 60 * 60 * 24)
    }
  },

  async getHomeSites(): Promise<MySite[] | undefined> {
    const key = redisKeys.homeSites()
    try {
      const str = await redis.get(key)
      if (str) {
        const sites = JSON.parse(str)
        if (Array.isArray(sites)) {
          const homeSites = sites as MySite[]
          return produce(homeSites, (draft) => {
            for (const site of draft) {
              site.createdAt = new Date(site.createdAt)
              site.updatedAt = new Date(site.updatedAt)
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateHomeSites(sites: MySite[] | null) {
    const key = redisKeys.homeSites()
    if (!sites) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(sites), 'EX', 60 * 60 * 24)
    }
  },

  async getAreaCreations(areaId: string): Promise<SiteCreation[] | undefined> {
    const key = redisKeys.areaCreations(areaId)
    try {
      const str = await redis.get(key)
      if (str) {
        const creations = JSON.parse(str)
        if (Array.isArray(creations)) {
          const siteCreations = creations as SiteCreation[]
          return produce(siteCreations, (draft) => {
            for (const item of draft) {
              item.createdAt = new Date(item.createdAt)
              item.updatedAt = new Date(item.updatedAt)
              if (item.publishedAt) {
                item.publishedAt = new Date(item.publishedAt)
              }
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateAreaCreations(areaId: string, creations: SiteCreation[] | null) {
    const key = redisKeys.areaCreations(areaId)
    if (!creations) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(creations), 'EX', 60 * 60 * 24)
    }
  },

  async getMoldCreation(
    siteId: string,
    moldId: string,
  ): Promise<SiteCreation[] | undefined> {
    const key = redisKeys.moldCreations(siteId, moldId)
    try {
      const str = await redis.get(key)
      if (str) {
        const creations = JSON.parse(str)
        if (Array.isArray(creations)) {
          const siteCreations = creations as SiteCreation[]
          return produce(siteCreations, (draft) => {
            for (const item of draft) {
              item.createdAt = new Date(item.createdAt)
              item.updatedAt = new Date(item.updatedAt)
              if (item.publishedAt) {
                item.publishedAt = new Date(item.publishedAt)
              }
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateMoldCreations(
    siteId: string,
    moldId: string,
    creations: SiteCreation[] | null,
  ) {
    const key = redisKeys.moldCreations(siteId, moldId)
    if (!creations) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(creations), 'EX', 60 * 60 * 24)
    }
  },

  async getNotes(areaId: string): Promise<Creation[] | undefined> {
    const key = redisKeys.notes(areaId)
    try {
      const str = await redis.get(key)
      if (str) {
        const list = JSON.parse(str)
        if (Array.isArray(list)) {
          const nodes = list as Creation[]
          return produce(nodes, (draft) => {
            for (const item of draft) {
              item.createdAt = new Date(item.createdAt)
              item.updatedAt = new Date(item.updatedAt)
              if (item.publishedAt) {
                item.publishedAt = new Date(item.publishedAt)
              }
            }
          })
        }
      }
    } catch (error) {}
  },

  async updateNotes(areaId: string, notes: Creation[] | null) {
    const key = redisKeys.notes(areaId)
    if (!notes) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(notes), 'EX', 60 * 60 * 24)
    }
  },

  async getCreation(creationId: string): Promise<Creation | undefined> {
    const key = redisKeys.creation(creationId)
    try {
      const str = await redis.get(key)
      if (str) {
        const creation = JSON.parse(str)
        const creationById = creation as Creation
        return produce(creationById, (draft) => {
          draft.createdAt = new Date(draft.createdAt)
          draft.updatedAt = new Date(draft.updatedAt)
        })
      }
    } catch (error) {}
  },

  async updateCreation(creationId: string, creation: Creation | null) {
    const key = redisKeys.creation(creationId)
    if (!creation) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(creation), 'EX', 60 * 60 * 24)
      return creation
    }
  },

  async updateCreationProps(creationId: string, creation: Partial<Creation>) {
    const cachedCreation = await cacheHelper.getCreation(creationId)

    if (cachedCreation) {
      return await cacheHelper.updateCreation(creationId, {
        ...cachedCreation,
        ...creation,
      })
    } else {
      await cacheHelper.updateCreation(creationId, null)
    }
  },

  async getArea(areaId: string): Promise<AreaById | undefined> {
    const key = redisKeys.area(areaId)
    try {
      const str = await redis.get(key)
      if (str) {
        const area = JSON.parse(str)
        const areaById = area as AreaById
        return produce(areaById, (draft) => {
          draft.createdAt = new Date(draft.createdAt)
          draft.updatedAt = new Date(draft.updatedAt)
        })
      }
    } catch (error) {}
  },

  async updateArea(areaId: string, area: AreaById | null) {
    const key = redisKeys.area(areaId)
    if (!area) {
      redis.del(key)
    } else {
      redis.set(key, JSON.stringify(area), 'EX', 60 * 60 * 24)
    }
  },
}
