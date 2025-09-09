import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite/vector'
import { drizzle } from 'drizzle-orm/pglite'
import { embeddings } from './schema'

const dbPath = 'idb://penx-vector'

export const pg = new PGlite(dbPath, {
  // extensions: { vector },
})

console.log('pg>>>>>>>>>>>>>pg:', pg)
async function run() {
  try {
    const r = await pg.query("select 'Hello world' as message;")
    console.log('r=>>>>>>>>>>>:', r)
  } catch (error) {
    console.log('pg error ==>>>>>>>>>>>:', error)
  }
}
run()

// export const pg = new PGlite(dbPath)

export const db = drizzle({ client: pg, schema: { embeddings } })
