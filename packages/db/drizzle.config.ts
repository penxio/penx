import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME || './pglite',
  },
})
