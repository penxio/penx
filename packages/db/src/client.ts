import { join } from 'path'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { app } from 'electron'
import { nodes } from './schema'

const dbPath = join(app.getPath('userData'), 'penx-db')

export const pg = new PGlite(dbPath)

export const db = drizzle({ client: pg, schema: { nodes } })
