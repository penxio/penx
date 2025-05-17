import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { IColumn, IStructNode } from '@penx/model-type'
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

  updateStruct(id: string, newStruct: IStructNode) {
    const structs = this.get()
    const newStructs = produce(structs, (draft) => {
      const index = draft.findIndex((s) => s.id === id)
      draft[index] = newStruct
    })
    this.set(newStructs)
  }

  async refetchStructs() {
    const site = this.store.site.get()
    const structs = await localDB.listStructs(site.id)
    this.set(structs)
    return structs
  }
}
