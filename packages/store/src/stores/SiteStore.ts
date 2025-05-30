import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { ACTIVE_SITE } from '@penx/constants'
import { db } from '@penx/pg'
import { AIProvider, AISetting, ISiteNode } from '@penx/model-type'
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
    // Ensure data is valid
    if (!data || typeof data !== 'object') {
      console.error('Invalid provider data')
      return
    }

    // Ensure type is specified
    if (!data.type) {
      console.error('Provider type is required')
      return
    }

    const site = this.get()
    const newSite = produce(site, (draft) => {
      // Initialize aiSetting if it doesn't exist
      if (!draft.props) {
        draft.props = {} as ISiteNode['props']
      }

      if (!draft.props.aiSetting) {
        draft.props.aiSetting = {
          providers: [],
        } as AISetting
      }

      if (!draft.props.aiSetting.providers) {
        draft.props.aiSetting.providers = []
      }

      // Check if a provider with the same type already exists
      const index = draft.props.aiSetting.providers.findIndex(
        (p) => p.type === data.type,
      )

      if (index === -1) {
        // Create a new provider with all required fields
        draft.props.aiSetting.providers.push({
          type: data.type,
          name: data.name || data.type,
          apiKey: data.apiKey || '',
          enabled: data.enabled !== undefined ? data.enabled : true,
          availableModels: data.availableModels || [],
          defaultModel: data.defaultModel || '',
          baseURL: data.baseURL,
        } as AIProvider)
      } else {
        // Update existing provider
        draft.props.aiSetting.providers[index] = {
          ...draft.props.aiSetting.providers[index],
          ...data,
        }
      }
    })

    this.set(newSite)
    await this.save(newSite)

    await db.updateSiteProps(newSite.id, {
      ...site.props,
      aiSetting: newSite.props.aiSetting,
    })
  }

  async deleteAIProvider(providerType: string) {
    if (!providerType) {
      console.error('Provider type is required for deletion')
      return
    }

    const site = this.get()
    const newSite = produce(site, (draft) => {
      if (draft.props?.aiSetting?.providers) {
        draft.props.aiSetting.providers =
          draft.props.aiSetting.providers.filter((p) => p.type !== providerType)
      }
    })

    this.set(newSite)
    await this.save(newSite)

    await db.updateSiteProps(newSite.id, {
      ...site.props,
      aiSetting: newSite.props.aiSetting,
    })
  }
}
