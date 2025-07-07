import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core'
import { uniqueId } from '@penx/unique-id'

export const embeddings = pgTable('embeddings', {
  id: varchar('id')
    .primaryKey()
    .$defaultFn(() => uniqueId()),
  nodeId: varchar('resource_id'),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
})