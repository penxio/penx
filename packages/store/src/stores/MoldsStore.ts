import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IMoldNode } from '@penx/model-type'
import { StoreType } from '../store-types'

export const moldsAtom = atom<IMoldNode[]>([])

export class MoldsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(moldsAtom)
  }

  set(state: IMoldNode[]) {
    this.store.set(moldsAtom, state)
  }

  async refetchMolds() {
    const site = this.store.site.get()
    const molds = await localDB.listMolds(site.id)
    this.set(molds)
    return molds
  }
}
