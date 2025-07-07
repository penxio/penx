import { homedir } from 'node:os'
import { join } from 'node:path'

export const DB_PATH = join(homedir(), 'penxdb')
