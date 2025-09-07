import { idb } from '@penx/indexeddb'
import { localDB } from '@penx/local-db'
import { INode } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'

export const initNodeModelApi = () => {
  const nodeModelApi = {
    async get(id: string) {
      return idb.node.get(id) as any
    },

    async getNodesByType(type: string) {
      return idb.node.where({ type }).toArray() as any
    },

    async findMany<T = INode>(where: Partial<INode>): Promise<T[]> {
      return idb.node.where(where).toArray() as any
    },

    async insert<T extends INode>(data: Partial<T>) {
      const newNodeId = await idb.node.add({
        id: uniqueId(),
        ...data,
      } as T)
      const node = (await idb.node.get(newNodeId)) as any as T
      return node
    },

    async insertMany<T = INode>(data: Partial<T>[]) {
      await idb.node.bulkAdd(data as any)
    },

    async update<T = INode>(id: string, updates: Partial<T>) {
      await idb.node.update(id, {
        ...updates,
        updatedAt: new Date(),
      })
    },

    async delete(id: string) {
      return idb.node.delete(id)
    },

    // TODO:
    async deleteMany(where: Partial<INode>) {
      if (where.spaceId) {
        return idb.node.where('spaceId').anyOf(where.spaceId).delete()
      }
    },

    deleteNodeByIds(nodeIds: string[]) {
      return idb.node.where('id').anyOf(nodeIds).delete()
    },
  }

  ;(self as any).nodeModelApi = nodeModelApi
  localDB.node = nodeModelApi
}
