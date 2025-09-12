import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const changes = pgTable(
  'change',
  {
    id: integer('id').notNull().primaryKey().generatedAlwaysAsIdentity(),
    operation: text('operation').notNull(),
    spaceId: uuid('space_id').notNull(),
    key: text('key').notNull(),
    data: jsonb('data'),
    synced: integer('synced').notNull().default(0), // 0 - not synced, 1 - synced
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_change_space_id').on(table.spaceId),
    index('idx_change_synced').on(table.synced),
    index('idx_change_space_synced').on(table.spaceId, table.synced),
  ],
)

export type Change = typeof changes.$inferSelect
