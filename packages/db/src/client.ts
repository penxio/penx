import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const pg = new PGlite();
export const client = drizzle({ client: pg });

