import { produce } from 'immer'
import { atom } from 'jotai'
import { editorDefaultValue } from '@penx/constants'
import { getRandomColorName } from '@penx/libs/color-helper'
import { generateStructNode } from '@penx/libs/getDefaultStructs'
import { localDB } from '@penx/local-db'
import { IColumn, IStructNode, NodeType } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'
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

  createStruct(name: string) {
    const site = this.store.site.get()
    const structs = this.get()
    const newStruct = generateStructNode('', name, {
      siteId: site.id,
      userId: site.userId,
    })

    const newStructs = produce(structs, (draft) => {
      draft.push(newStruct)
    })

    this.set(newStructs)
    localDB.addStruct(newStruct)
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
