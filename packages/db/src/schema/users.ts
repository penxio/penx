import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert

export const usersInsertSchema = createInsertSchema(users)
export const usersSelectSchema = createSelectSchema(users)
