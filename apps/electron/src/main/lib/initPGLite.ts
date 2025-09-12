import { sql } from 'drizzle-orm';
import { db } from '@penx/db/client';
import { embeddings } from '@penx/db/schema/embeddings';
import { nodes } from '@penx/db/schema/nodes';
import { changes } from '@penx/db/schema/change';


export async function initPGLite() {
  try {
    // Check if tables exist
    const tableStatus = await checkTablesExist()

    // Create tables that don't exist
    if (!tableStatus.nodeExists) {
      await createNodeTable()
    }

    if (!tableStatus.embeddingExists) {
      await createEmbeddingTable()
    }

    if (!tableStatus.changeExists) {
      await createChangeTable()
    }

    console.log('PGLite database initialized successfully')
  } catch (error: any) {
    console.error('Failed to initialize PGLite database:', error)
    // Don't throw here as the app should still work without the database
  }
}

async function checkTablesExist() {
  let nodeExists = false
  let embeddingExists = false
  let changeExists = false

  try {
    await db.select().from(nodes).limit(1)
    nodeExists = true
    console.log('Node table exists')
  } catch (error: any) {
    console.log('Node table does not exist, will create it')
  }

  try {
    await db.select().from(embeddings).limit(1)
    embeddingExists = true
    console.log('Embeddings table exists')
  } catch (error: any) {
    console.log('Embeddings table does not exist, will create it')
  }

  try {
    await db.select().from(changes).limit(1)
    changeExists = true
    console.log('Change table exists')
  } catch (error: any) {
    console.log('Change table does not exist, will create it')
  }

  return { nodeExists, embeddingExists, changeExists }
}

async function createNodeTable() {
  try {
    // Create table
    await db.execute(sql`
      CREATE TABLE "node" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "type" text NOT NULL,
        "props" jsonb NOT NULL,
        "created_at" timestamp NOT NULL,
        "updated_at" timestamp NOT NULL,
        "area_id" uuid,
        "user_id" uuid NOT NULL,
        "space_id" uuid NOT NULL
      )
    `)
    console.log('Created node table')

    // Create indexes
    await db.execute(
      sql`CREATE INDEX "idx_node_space" ON "node" USING btree ("space_id")`,
    )
    await db.execute(
      sql`CREATE INDEX "idx_node_area" ON "node" USING btree ("area_id")`,
    )
    await db.execute(
      sql`CREATE INDEX "idx_node_space_area" ON "node" USING btree ("space_id","area_id")`,
    )
    await db.execute(
      sql`CREATE INDEX "idx_node_space_type" ON "node" USING btree ("space_id","type")`,
    )

    await db.execute(
      sql`CREATE INDEX "idx_node_props_struct_id" ON "node" USING btree (("props"->>'structId'))`,
    )

    console.log('Created node table indexes')
  } catch (error: any) {
    // If table already exists, that's fine
    if (
      error.message?.includes('already exists') ||
      error.message?.includes('duplicate key')
    ) {
      console.log('Node table or index already exists, skipping creation')
    } else {
      console.error('Node table creation error:', error)
      throw error
    }
  }
}

async function createEmbeddingTable() {
  try {
    // Ensure vector extension is enabled
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`)
    console.log('Vector extension enabled')

    // Create embeddings table
    await db.execute(sql`
      CREATE TABLE "embedding" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "node_id" uuid,
        "user_id" uuid,
        "metadata" jsonb NOT NULL,
        "embedding" vector(384) NOT NULL
      )
    `)
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

async function createChangeTable() {
  try {
    // Create change table
    await db.execute(sql`
      CREATE TABLE "change" (
        "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "change_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
        "operation" text NOT NULL,
        "space_id" uuid NOT NULL,
        "key" text NOT NULL,
        "data" jsonb,
        "synced" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `)
    console.log('Created change table')

    // Create indexes
    await db.execute(
      sql`CREATE INDEX "idx_change_space_id" ON "change" USING btree ("space_id")`,
    )
    await db.execute(
      sql`CREATE INDEX "idx_change_synced" ON "change" USING btree ("synced")`,
    )
    await db.execute(
      sql`CREATE INDEX "idx_change_space_synced" ON "change" USING btree ("space_id","synced")`,
    )

    console.log('Created change table indexes')
  } catch (error: any) {
    // If table already exists, that's fine
    if (
      error.message?.includes('already exists') ||
      error.message?.includes('duplicate key')
    ) {
      console.log('Change table or index already exists, skipping creation')
    } else {
      console.error('Change table creation error:', error)
      throw error
    }
  }
}