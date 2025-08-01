import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const nodes = pgTable(
  'node',
  {
    id: uuid('id').notNull().defaultRandom().primaryKey(),
    type: text('type').notNull(),
    props: jsonb('props').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),

    areaId: uuid('area_id'),
    userId: uuid('user_id').notNull(),
    spaceId: uuid('space_id').notNull(),
  },
  (table) => [
    index('idx_node_space').on(table.spaceId),
    index('idx_node_area').on(table.areaId),
    index('idx_node_space_area').on(table.spaceId, table.areaId),
    index('idx_node_space_type').on(table.spaceId, table.type),
  ],
)
