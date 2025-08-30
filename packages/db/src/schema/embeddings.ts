import { sql } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from 'drizzle-orm/pg-core'

export const embeddings = pgTable(
  'embedding',
  {
    id: uuid('id').notNull().defaultRandom().primaryKey(),
    nodeId: uuid('node_id'),
    userId: uuid('user_id'),
    metadata: jsonb('metadata').notNull(),
    embedding: vector('embedding', { dimensions: 384 }).notNull(),
  },
  (table) => [
    index('idx_embedding_node_id').on(table.nodeId),
    index('idx_embedding_user_id').on(table.userId),

    index('embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),

    index('idx_embedding_props_struct_id').using(
      'btree',
      sql`(${table.metadata}->>'structId')`,
    ),

    index('idx_embedding_props_node_id').using(
      'btree',
      sql`(${table.metadata}->>'nodeId')`,
    ),
  ],
)
