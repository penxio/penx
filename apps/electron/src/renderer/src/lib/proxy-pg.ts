import { eq } from 'drizzle-orm'
import { nodes } from '@penx/db'
import { createProxyClient } from '@penx/db/proxy-client'

// Database usage example in renderer layer
export class ProxyPG {
  private db: ReturnType<typeof createProxyClient>

  constructor(baseUrl: string = 'http://localhost:14158') {
    this.db = createProxyClient(baseUrl)
  }

  // Query all nodes
  async getAllNodes() {
    return await this.db.select().from(nodes)
  }

  // Query node by ID
  async getNodeById(id: string) {
    return await this.db.select().from(nodes).where(eq(nodes.id, id))
  }

  // Query nodes by type
  async getNodesByType(type: string) {
    return await this.db.select().from(nodes).where(eq(nodes.type, type))
  }

  // Insert new node
  async insertNode(nodeData: {
    type: string
    props: any
    userId: string
    spaceId: string
    areaId?: string
  }) {
    return await this.db.insert(nodes).values({
      ...nodeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Update node
  async updateNode(id: string, updates: Partial<typeof nodes.$inferInsert>) {
    return await this.db
      .update(nodes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(nodes.id, id))
  }

  // Delete node
  async deleteNode(id: string) {
    return await this.db.delete(nodes).where(eq(nodes.id, id))
  }
}

// Usage example
export const useRendererDB = () => {
  return new ProxyPG()
}
