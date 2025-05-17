import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IStructNode } from '@penx/model-type'
import { StoreType } from '../store-types'

export const structsAtom = atom<IStructNode[]>([])

export class StructsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(structsAtom)
  }

  set(state: IStructNode[]) {
    this.store.set(structsAtom, state)
  }

  async refetchStructs() {
    const site = this.store.site.get()
    const structs = await localDB.listStructs(site.id)
    this.set(structs)
    return structs
  }
}
