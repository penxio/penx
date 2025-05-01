import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { ACTIVE_SITE } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { AIProvider, ISite } from '@penx/model-type'
import { StoreType } from '../store-types'

export const siteAtom = atom<ISite>(null as unknown as ISite)

export class SiteStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(siteAtom)
  }

  set(state: ISite) {
    this.store.set(siteAtom, state)
  }

  async fetch() {
    const site = await get(ACTIVE_SITE)
    return site as ISite
  }

  async save(site: ISite) {
    await set(ACTIVE_SITE, site)
  }

  async updateAIProvider(data: Partial<AIProvider>) {
    const site = this.get()
    const newSite = produce(site, (draft) => {
      if (!draft.aiProviders?.length) draft.aiProviders = []
      const index = draft.aiProviders.findIndex((p) => p.type === data.type)
      if (index === -1) {
        draft.aiProviders.push(data as AIProvider)
      } else {
        draft.aiProviders[index] = { ...draft.aiProviders[index], ...data }
      }

      if (Reflect.has(data, 'enabled') && data.enabled) {
        for (const item of draft.aiProviders) {
          item.enabled = item.type === data.type
        }
      }
    })

    this.set(newSite)
    await this.save(newSite)

    await localDB.site.update(newSite.id, {
      aiProviders: newSite.aiProviders,
    })
  }
}
