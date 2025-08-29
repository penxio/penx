import { eq } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { embeddings } from '@penx/db/schema'

export async function getNodeEmbedding(nodeId: string) {
  const list = await db.query.embeddings.findMany({
    where: eq(embeddings.nodeId, nodeId),
  })
  return list
}
