import { sql } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { nodes } from '@penx/db/schema/nodes'

export async function initPGLite() {
  try {
    // Check if node table already exists using Drizzle ORM
    let tableExists = false

    try {
      // Try to query the table to see if it exists
      await db.select().from(nodes).limit(1)
      tableExists = true
      console.log('Node table exists, skipping creation')
    } catch (error: any) {
      // If the table doesn't exist, we'll get an error
      console.log('Node table does not exist, will create it')
      tableExists = false
    }

    if (tableExists) {
      console.log('Node table already exists, skipping creation')
      return
    }

    // Create the table using Drizzle's sql function

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
      console.log('Created all indexes')
    } catch (error: any) {
      // If table already exists, that's fine
      if (
        error.message?.includes('already exists') ||
        error.message?.includes('duplicate key')
      ) {
        console.log('Table or index already exists, skipping creation')
      } else {
        console.error('Migration error:', error)
        throw error
      }
    }

    console.log('PGLite database initialized successfully')
  } catch (error: any) {
    console.error('Failed to initialize PGLite database:', error)
    // Don't throw here as the app should still work without the database
  }
}
