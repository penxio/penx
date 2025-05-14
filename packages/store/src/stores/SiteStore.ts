import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { ACTIVE_SITE } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { AIProvider, ISiteNode } from '@penx/model-type'
import { StoreType } from '../store-types'

export const siteAtom = atom<ISiteNode>(null as unknown as ISiteNode)

export class SiteStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(siteAtom)
  }

  set(state: ISiteNode) {
    this.store.set(siteAtom, state)
  }

  async fetch() {
    const site = await get(ACTIVE_SITE)
    return site as ISiteNode
  }

  async save(site: ISiteNode) {
    await set(ACTIVE_SITE, site)
  }

  async updateAIProvider(data: Partial<AIProvider>) {
    const site = this.get()
    const newSite = produce(site, (draft) => {
      if (!draft.props.aiProviders?.length) draft.props.aiProviders = []
      const index = draft.props.aiProviders.findIndex(
        (p) => p.type === data.type,
      )
      if (index === -1) {
        draft.props.aiProviders.push(data as AIProvider)
      } else {
        draft.props.aiProviders[index] = {
          ...draft.props.aiProviders[index],
          ...data,
        }
      }

      if (Reflect.has(data, 'enabled') && data.enabled) {
        for (const item of draft.props.aiProviders) {
          item.enabled = item.type === data.type
        }
      }
    })

    this.set(newSite)
    await this.save(newSite)

    await localDB.updateSiteProps(newSite.id, {
      ...site.props,
      aiProviders: newSite.props.aiProviders,
    })
  }
}
