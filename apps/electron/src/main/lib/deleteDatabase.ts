import { existsSync, rmSync } from 'fs'
import { join } from 'path'
import { sql } from 'drizzle-orm'
import { app } from 'electron'
import { db } from '@penx/db/client'

/**
 * Complete function to delete PGLite database
 *
 * This function will:
 * 1. Check if the database is accessible
 * 2. Delete all tables, sequences, and extensions
 * 3. Delete the database file directory
 *
 * Usage example:
 * ```typescript
 * import { deleteDatabase } from './lib/deleteDatabase'
 *
 * try {
 *   await deleteDatabase()
 *   console.log('Database deleted successfully')
 * } catch (error) {
 *   console.error('Failed to delete database:', error)
 * }
 * ```
 */
export async function deleteDatabase() {
  const dbPath = join(app.getPath('userData'), 'penx-db')

  try {
    console.log('Starting deletion of PGLite database...')
    console.log('Database path:', dbPath)

    // Step 1: Check if database exists and is accessible
    await checkDatabaseAccess()

    // Step 2: Delete all tables in the database
    await deleteAllTables()

    // Step 3: Delete the database directory
    await deleteDatabaseDirectory(dbPath)

    console.log('Successfully deleted PGLite database')
  } catch (error: any) {
    console.error('Failed to delete PGLite database:', error)
    throw new Error(`Failed to delete PGLite database: ${error.message}`)
  }
}

async function checkDatabaseAccess() {
  try {
    console.log('Checking database access...')

    // Try a simple query to check if database is accessible
    await db.execute(sql`SELECT 1 as test`)
    console.log('Database is accessible')
  } catch (error: any) {
    console.warn(
      'Database may not be accessible or already deleted:',
      error.message,
    )
    // Don't throw here, as the database might already be deleted
  }
}

async function deleteAllTables() {
  try {
    console.log('Deleting all tables from database...')

    // Get all table names
    const tablesResult = await db.execute(sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `)

    const tableNames = tablesResult.rows.map((row: any) => row[0])

    console.log('Found tables:', tableNames)

    if (tableNames.length === 0) {
      console.log('No tables found in database')
      return
    }

    // Drop all tables with CASCADE to handle dependencies
    for (const tableName of tableNames) {
      try {
        await db.execute(sql`DROP TABLE IF EXISTS "${tableName}" CASCADE`)
        console.log(`Dropped table: ${tableName}`)
      } catch (error: any) {
        console.warn(`Failed to drop table ${tableName}:`, error.message)
      }
    }

    // Also drop any remaining sequences
    const sequencesResult = await db.execute(sql`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `)

    const sequenceNames = sequencesResult.rows.map((row: any) => row[0])

    if (sequenceNames.length > 0) {
      console.log('Found sequences:', sequenceNames)

      for (const sequenceName of sequenceNames) {
        try {
          await db.execute(
            sql`DROP SEQUENCE IF EXISTS "${sequenceName}" CASCADE`,
          )
          console.log(`Dropped sequence: ${sequenceName}`)
        } catch (error: any) {
          console.warn(
            `Failed to drop sequence ${sequenceName}:`,
            error.message,
          )
        }
      }
    }

    // Drop any remaining extensions
    const extensionsResult = await db.execute(sql`
      SELECT extname 
      FROM pg_extension 
      WHERE extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `)

    const extensionNames = extensionsResult.rows.map((row: any) => row[0])

    if (extensionNames.length > 0) {
      console.log('Found extensions:', extensionNames)

      for (const extensionName of extensionNames) {
        try {
          await db.execute(
            sql`DROP EXTENSION IF EXISTS "${extensionName}" CASCADE`,
          )
          console.log(`Dropped extension: ${extensionName}`)
        } catch (error: any) {
          console.warn(
            `Failed to drop extension ${extensionName}:`,
            error.message,
          )
        }
      }
    }

    console.log('All tables, sequences, and extensions deleted successfully')
  } catch (error: any) {
    console.error('Failed to delete tables:', error)
    throw error
  }
}

async function deleteDatabaseDirectory(dbPath: string) {
  try {
    console.log('Deleting database directory...')

    if (!existsSync(dbPath)) {
      console.log('Database directory does not exist, nothing to delete')
      return
    }

    // Use rmSync with recursive option to delete the entire directory
    rmSync(dbPath, { recursive: true, force: true })
    console.log('Database directory deleted successfully')
  } catch (error: any) {
    console.error('Failed to delete database directory:', error)
    throw error
  }
}
