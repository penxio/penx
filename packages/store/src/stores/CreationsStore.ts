import { produce } from 'immer'
import { atom } from 'jotai'
import { ICreationNode } from '@penx/model-type'
import { db } from '@penx/pg'
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
    await db.addCreation(creation)
  }

  async updateCreationById(creationId: string, data: Partial<ICreationNode>) {
    const creations = this.get()

    const newCreations = produce(creations, (draft) => {
      const index = draft.findIndex((p) => p.id === creationId)
      draft[index] = {
        ...draft[index],
        ...data,
      }
    })

    this.set(newCreations)
  }

  async deleteCreation(creation: ICreationNode) {
    await db.deleteCreation(creation.id)
    this.refetchCreations()
  }

  async refetchCreations(areaId?: string) {
    const area = this.store.area.get()
    const newCreations = await db.listCreationsByArea(areaId || area.id)
    this.set(newCreations)
  }
}
