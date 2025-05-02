import { set } from 'idb-keyval'
import { produce } from 'immer'
import { atom } from 'jotai'
import { localDB } from '@penx/local-db'
import { ICreation } from '@penx/model-type'
import { api } from '@penx/trpc-client'
import { StoreType } from '../store-types'

export const creationsAtom = atom<ICreation[]>([])

export class CreationsStore {
  constructor(private store: StoreType) {}

  get() {
    return this.store.get(creationsAtom)
  }

  set(state: ICreation[]) {
    this.store.set(creationsAtom, state)
  }

  async addCreation(creation: ICreation) {
    const creations = this.get()
    this.set([...creations, creation])
    await localDB.addCreation(creation)
  }

  async updateCreationById(creationId: string, data: Partial<ICreation>) {
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

  async deleteCreation(creation: ICreation) {
    const area = this.store.area.get()
    await localDB.deleteCreation(creation.id)

    const newCreations = await localDB.creation
      .where({ areaId: area.id })
      .toArray()

    this.set(newCreations)
  }

  async refetchCreations(areaId?: string) {
    const area = this.store.area.get()
    console.log('=====areaId:', areaId, 'area:', area)
    const newCreations = await localDB.creation
      .where({ areaId: areaId || area.id })
      .toArray()

    this.set(newCreations)
  }
}
