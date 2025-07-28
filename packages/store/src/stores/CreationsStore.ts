import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { ICreationNode } from '@penx/model-type'
import { StoreType } from '../store-types'

export const creationsAtom = atom<ICreationNode[]>([])

export class CreationsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(creationsAtom)
  }

  set(state: ICreationNode[]) {
    this.store.set(creationsAtom, state)
  }

  async addCreation(creation: ICreationNode) {
    const creations = this.get()
    this.set([...creations, creation])
    await localDB.addCreation(creation)
  }

  async updateCreationById(creationId: string, input: Partial<ICreationNode>) {
    const creations = this.get()

    const newCreations = produce(creations, (draft) => {
      const index = draft.findIndex((p) => p.id === creationId)
      draft[index] = {
        ...draft[index],
        ...input,
      }
    })

    this.set(newCreations)
  }

  async updateCreationDataById(creationId: string, data: any) {
    const creations = this.get()

    let newData = {}
    const newCreations = produce(creations, (draft) => {
      const index = draft.findIndex((p) => p.id === creationId)
      newData = {
        ...draft[index].props.data,
        ...data,
      }
      draft[index].props.data = newData
    })

    this.set(newCreations)

    await localDB.updateCreationProps(creationId, {
      data: newData,
    })
  }

  async deleteCreation(creation: ICreationNode) {
    await localDB.deleteCreation(creation.id)
    await this.refetchCreations()
  }

  async refetchCreations(areaId?: string) {
    const area = this.store.area.get()
    const newCreations = await localDB.listCreationsByArea(areaId || area.id)
    this.set(newCreations)
  }
}
