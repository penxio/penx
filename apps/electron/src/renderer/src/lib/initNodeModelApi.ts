import { and, eq, inArray, SQL } from 'drizzle-orm'
import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'
import { localDB } from '@penx/local-db'
import { INode } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'

export const initNodeModelApi = () => {
  const db = createProxyClient()

  const nodeModelApi = {
    async get(id: string) {
      const rows = await db.select().from(nodes).where(eq(nodes.id, id))
      return rows?.[0] as any
    },

    async getNodesByType(type: string) {
      return db.select().from(nodes).where(eq(nodes.type, type)) as any
    },

    async findMany<T = INode>(where: Partial<INode>): Promise<T[]> {
      const filters: SQL[] = []
      if (where.id) filters.push(eq(nodes.id, where.id))
      if (where.type) filters.push(eq(nodes.type, where.type))
      if (where.userId) filters.push(eq(nodes.userId, where.userId))
      if (where.spaceId) filters.push(eq(nodes.spaceId, where.spaceId))
      if (where.areaId) filters.push(eq(nodes.areaId, where.areaId))

      const list = await db
        .select()
        .from(nodes)
        .where(and(...filters))

      return list as any
    },

    async insert<T = INode>(data: Partial<T>) {
      const rows = await db
        .insert(nodes)
        .values({
          id: uniqueId(),
          ...data,
        } as any)
        .returning()
      return rows[0] as any
    },

    async insertMany<T = INode>(data: Partial<T>[]) {
      if (!data.length) return
      await db.insert(nodes).values(data as any[])
    },

    async update<T = INode>(id: string, updates: Partial<T>) {
      return await db
        .update(nodes)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(nodes.id, id))
    },

    async delete(id: string) {
      return await db.delete(nodes).where(eq(nodes.id, id))
    },

    async deleteMany(where: Partial<INode>) {
      const filters: SQL[] = []
      if (where.id) filters.push(eq(nodes.id, where.id))
      if (where.type) filters.push(eq(nodes.type, where.type))
      if (where.userId) filters.push(eq(nodes.userId, where.userId))
      if (where.spaceId) filters.push(eq(nodes.spaceId, where.spaceId))
      if (where.areaId) filters.push(eq(nodes.areaId, where.areaId))

      return db.delete(nodes).where(and(...filters))
    },

    deleteNodeByIds(nodeIds: string[]) {
      return db.delete(nodes).where(inArray(nodes.id, nodeIds))
    },
  }

  localDB.node = nodeModelApi
}
