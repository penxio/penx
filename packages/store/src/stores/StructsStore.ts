import { produce } from 'immer'
import { atom } from 'jotai'
import { Struct } from '@penx/domain'
import { getRandomColorName } from '@penx/libs/color-helper'
import { generateStructNode } from '@penx/libs/getDefaultStructs'
import { localDB } from '@penx/local-db'
import { IColumn, IStructNode } from '@penx/model-type'
import { Option } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { StoreType } from '../store-types'

export const structsAtom = atom<IStructNode[]>([])

export type InstallStructInput = {
  id: string
  name: string
  pluralName?: string
  description?: string
  type?: string
  color?: string
  about?: string
  columns: IColumn[]
}

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
    const area = this.store.area.get()
    const structs = this.get()
    const newStruct = generateStructNode({
      type: name.toUpperCase(),
      name,
      areaId: area.id,
      siteId: site.id,
      userId: site.userId,
    })

    const newStructs = produce(structs, (draft) => {
      draft.push(newStruct)
    })

    this.set(newStructs)
    localDB.addStruct(newStruct)
  }

  installStruct(input: InstallStructInput) {
    const site = this.store.site.get()
    const structs = this.get()
    const area = this.store.area.get()
    const newStruct = generateStructNode({
      ...input,
      areaId: area.id,
      siteId: site.id,
      userId: site.userId,
    })

    const newStructs = produce(structs, (draft) => {
      draft.push(newStruct)
    })

    this.set(newStructs)
    localDB.addStruct(newStruct)
  }

  async deleteStruct(id: string) {
    await localDB.deleteStruct(id)
    const panels = this.store.panels.get()
    const panel = panels.find((p) => p.widget?.structId === id)
    if (panel) this.store.panels.closePanel(panel.id)
    await this.refetchStructs()
  }

  updateStruct(id: string, newStruct: IStructNode) {
    const structs = this.get()
    const newStructs = produce(structs, (draft) => {
      const index = draft.findIndex((s) => s.id === id)
      draft[index] = newStruct
    })
    this.set(newStructs)
  }

  async addOption(struct: Struct, columnId: string, name: string) {
    const id = uniqueId()
    const newOption: Option = {
      id,
      name,
      color: getRandomColorName(),
      isDefault: false,
    }

    const newStruct = produce(struct.raw, (draft) => {
      for (const column of draft.props.columns) {
        if (column.id === columnId) {
          column.options = [...column.options, newOption]
          break
        }
      }
    })

    this.updateStruct(struct.id, newStruct)

    localDB.updateStructProps(struct.id, {
      columns: newStruct.props.columns,
    })

    return newOption
  }

  async refetchStructs(areaId?: string) {
    const area = this.store.area.get()
    const structs = await localDB.listStructs(areaId || area.id)
    this.set(structs)
    return structs
  }
}
