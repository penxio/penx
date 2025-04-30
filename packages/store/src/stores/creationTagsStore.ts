import { set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { ICreationTag } from '@penx/model-type'
import { api } from '@penx/trpc-client'
import { StoreType } from '../store-types'

export const creationTagsAtom = atom<ICreationTag[]>(
  null as unknown as ICreationTag[],
)

export class CreationTagsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(creationTagsAtom)
  }

  set(state: ICreationTag[]) {
    this.store.set(creationTagsAtom, state)
  }

  setCreationTags(state: ICreationTag[]) {
    this.set(state)
  }

  async refetchCreationTags() {
    const siteId = this.store.site.get().id
    const list = await localDB.creationTag.where({ siteId }).toArray()
    this.setCreationTags(list)
  }
}
