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
  'embeddings',
  {
    id: uuid('id').notNull().defaultRandom().primaryKey(),
    nodeId: uuid('node_id'),
    metadata: jsonb('metadata').notNull(),
    embedding: vector('embedding', { dimensions: 384 }).notNull(),
  },
  (table) => [
    index('embedding_index').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
)
