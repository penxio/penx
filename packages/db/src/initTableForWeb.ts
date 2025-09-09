import { sql } from 'drizzle-orm'
import { embeddings } from './schema/embeddings'
import { db, pg } from './web-client'

export async function initTableForWeb() {
  try {
    // Check if tables exist
    const tableStatus = await checkTablesExist()

    if (!tableStatus.embeddingExists) {
      await createEmbeddingTable()
    }

    console.log('PGLite database initialized successfully')
  } catch (error: any) {
    console.error('Failed to initialize PGLite database:', error)
    // Don't throw here as the app should still work without the database
  }
}

async function checkTablesExist() {
  let embeddingExists = false

  try {
    await db.select().from(embeddings).limit(1)
    embeddingExists = true
    console.log('Embeddings table exists')
  } catch (error: any) {
    console.log('Embeddings table does not exist, will create it')
  }

  return { embeddingExists }
}

async function createEmbeddingTable() {
  try {
    console.log('11111111111111111111>>>>>>>>>>>>>>>>>')

    // Ensure vector extension is enabled
    // await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`)

    // try {
    //   await pg.exec(`CREATE EXTENSION IF NOT EXISTS vector;`)
    // } catch (error) {
    //   console.log('===++>>>>>error:', error)
    // }

    // await pg.exec(`CREATE EXTENSION IF NOT EXISTS vector`)
    // console.log('2222222222222>>>>>>>>>>>>>>>>')

    // console.log('Vector extension enabled')

    // Create embeddings table
    await pg.exec(`
      CREATE TABLE "embedding" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "node_id" uuid,
        "user_id" uuid,
        "metadata" jsonb NOT NULL,
        "embedding" vector(384) NOT NULL
      )
    `)

    console.log('333333>>>>>>>>>>>>>>>>')

    console.log('Created embedding table')

    await db.execute(
      sql`CREATE INDEX "idx_embedding_node_id" ON "embedding" USING btree ("node_id")`,
    )

    await db.execute(
      sql`CREATE INDEX "idx_embedding_user_id" ON "embedding" USING btree ("user_id")`,
    )

    // Create HNSW index for vector similarity search
    await db.execute(
      sql`CREATE INDEX "embedding_index" ON "embedding" USING hnsw ("embedding" vector_cosine_ops)`,
    )

    await db.execute(
      sql`CREATE INDEX "idx_embedding_props_struct_id" ON "embedding" USING btree (("metadata"->>'structId'))`,
    )

    await db.execute(
      sql`CREATE INDEX "idx_embedding_props_node_id" ON "embedding" USING btree (("metadata"->>'nodeId'))`,
    )

    console.log('Created embedding table index')
  } catch (error: any) {
    // If table already exists, that's fine
    if (
      error.message?.includes('already exists') ||
      error.message?.includes('duplicate key')
    ) {
      console.log('Embeddings table or index already exists, skipping creation')
    } else {
      console.error('Embeddings table creation error:', error)
      throw error
    }
  }
}
