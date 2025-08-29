import { eq, inArray, sql } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { embeddings, nodes } from '@penx/db/schema'

export async function deleteNodeEmbedding(nodeId: string, isStruct: boolean) {
  if (isStruct) {
    console.log('delete........struct')
    await db
      .delete(embeddings)
      .where(sql`${embeddings.metadata}->>'structId' = ${nodeId}`)
  } else {
    await db.delete(embeddings).where(eq(embeddings.nodeId, nodeId))
  }

  console.log(`Successfully delete embeddings for node ${nodeId}`)
}
