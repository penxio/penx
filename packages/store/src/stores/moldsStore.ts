import { set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IMold } from '@penx/model-type'
import { StoreType } from '../store-types'

export const moldsAtom = atom<IMold[]>(null as unknown as IMold[])

export class MoldsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(moldsAtom)
  }

  set(state: IMold[]) {
    this.store.set(moldsAtom, state)
  }

  setMolds(molds: IMold[]) {
    this.set(molds)
  }
}
