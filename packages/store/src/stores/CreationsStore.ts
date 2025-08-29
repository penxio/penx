import { produce } from 'immer'
import { atom } from 'jotai'
import ky from 'ky'
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

  async updateCreationProps(
    creationId: string,
    input: Partial<ICreationNode['props']>,
  ) {
    const creations = this.get()

    const newCreations = produce(creations, (draft) => {
      const index = draft.findIndex((p) => p.id === creationId)
      draft[index].props = {
        ...draft[index].props,
        ...input,
      }
    })

    this.set(newCreations)

    await localDB.updateCreationProps(creationId, {
      ...input,
    })
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
    this.deleteNodeEmbedding(creation)
  }

  async refetchCreations(areaId?: string) {
    const area = this.store.area.get()
    const newCreations = await localDB.listCreationsByArea(areaId || area.id)
    this.set(newCreations)
  }

  private async deleteNodeEmbedding(creation: ICreationNode) {
    try {
      await ky
        .post('http://localhost:14158/api/rag/deleteEmbedding', {
          json: { nodeId: creation.id, isStruct: false },
        })
        .json()
    } catch (error) {
      console.log('delete node embedding error:', error)
    }
  }
}
