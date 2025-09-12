import { join } from 'path'
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite/vector'
import { drizzle } from 'drizzle-orm/pglite'
import { app } from 'electron'
import { changes, embeddings, nodes } from './schema'

const dbPath = join(app.getPath('userData'), 'penx-db')

export const pg = new PGlite(dbPath, {
  extensions: { vector },
})

export const db = drizzle({
  client: pg,
  schema: { nodes, embeddings, changes },
})
