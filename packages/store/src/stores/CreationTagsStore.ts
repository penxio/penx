import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { ICreationTagNode } from '@penx/model-type'
import { StoreType } from '../store-types'

export const creationTagsAtom = atom<ICreationTagNode[]>(
  null as unknown as ICreationTagNode[],
)

export class CreationTagsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(creationTagsAtom)
  }

  set(state: ICreationTagNode[]) {
    this.store.set(creationTagsAtom, state)
  }

  async refetchCreationTags() {
    const areaId = this.store.area.get().id
    const list = await localDB.listCreationTags(areaId)
    this.set(list)
  }
}
