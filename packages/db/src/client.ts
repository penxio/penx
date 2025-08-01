import { join } from 'path'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { app } from 'electron'

const dbPath = join(app.getPath('userData'), 'penx-db')

const pg = new PGlite(dbPath)

export const client = drizzle({ client: pg })
