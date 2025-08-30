import { sql } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { embeddings } from '@penx/db/schema/embeddings'

export async function deleteEmbeddingTable() {
  try {
    console.log('Starting deletion of embedding table...')

    // Check if embedding table exists first
    const tableExists = await checkEmbeddingsTableExists()

    if (!tableExists) {
      console.log('Embedding table does not exist, nothing to delete')
      return
    }

    // Drop the embedding table
    await db.execute(sql`DROP TABLE IF EXISTS "embedding" CASCADE`)
    console.log('Successfully deleted embedding table')
  } catch (error: any) {
    console.error('Failed to delete embedding table:', error)
    throw new Error(`Failed to delete embedding table: ${error.message}`)
  }
}

async function checkEmbeddingsTableExists(): Promise<boolean> {
  try {
    // Try to query the embedding table
    await db.select().from(embeddings).limit(1)
    return true
  } catch (error: any) {
    return false
  }
}
