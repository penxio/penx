import { get, set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { ACTIVE_SPACE } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { AIProvider, AISetting, ISpaceNode } from '@penx/model-type'
import { StoreType } from '../store-types'

export const spaceAtom = atom<ISpaceNode>(null as unknown as ISpaceNode)

export class SpaceStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(spaceAtom)
  }

  set(state: ISpaceNode) {
    this.store.set(spaceAtom, state)
  }

  async fetch() {
    const site = await get(ACTIVE_SPACE)
    return site as ISpaceNode
  }

  async save(space: ISpaceNode) {
    await set(ACTIVE_SPACE, space)
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

    const space = this.get()
    const newSpace = produce(space, (draft) => {
      // Initialize aiSetting if it doesn't exist
      if (!draft.props) {
        draft.props = {} as ISpaceNode['props']
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

    this.set(newSpace)
    await this.save(newSpace)

    await localDB.updateSpaceProps(newSpace.id, {
      ...space.props,
      aiSetting: newSpace.props.aiSetting,
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

    await localDB.updateSpaceProps(newSite.id, {
      ...site.props,
      aiSetting: newSite.props.aiSetting,
    })
  }
}
