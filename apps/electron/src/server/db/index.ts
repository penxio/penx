import { join } from 'path'
import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite/vector'

export class PgLiteServer {
  private static instance: PgLiteServer | null = null
  private db: PGlite | null = null

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the default database path based on operating system
   * @returns Database directory path
   */
  private getDefaultDbPath(): string {
    const platform = process.platform
    const os = require('os')

    const homeDir = os.homedir()

    let dbPath: string

    if (platform === 'win32') {
      dbPath = join(homeDir, 'PenX', 'Database') // C:\Users\username\PenX\Database
    } else if (platform === 'darwin') {
      dbPath = join(homeDir, 'PenX', 'Database') // ~/PenX/Database
    } else {
      dbPath = join(homeDir, 'PenX', 'Database') // ~/PenX/Database
    }

    return dbPath
  }

  /**
   * Initialize PGlite database with vector extension
   * @param customPath Optional custom database path
   * @returns PGlite instance
   */
  private async initializeDb(customPath?: string): Promise<PGlite> {
    if (this.db) {
      return this.db
    }

    const dbPath = customPath || this.getDefaultDbPath()

    console.log(`Initializing PGlite database at: ${dbPath}`)

    this.db = new PGlite(dbPath, {
      extensions: {
        vector, // Enable vector extension by default
      },
    })

    // Ensure vector extension is installed
    try {
      await this.db.query('CREATE EXTENSION IF NOT EXISTS vector;')
      console.log('Vector extension installed successfully')
    } catch (error) {
      console.warn('Failed to install vector extension:', error)
    }

    return this.db
  }

  /**
   * Get the singleton PgLiteServer instance
   * @returns PgLiteServer instance
   */
  public static getInstance(): PgLiteServer {
    if (!PgLiteServer.instance) {
      PgLiteServer.instance = new PgLiteServer()
    }
    return PgLiteServer.instance
  }

  /**
   * Get the PGlite database instance
   * @param customPath Optional custom database path
   * @returns PGlite instance
   */
  public async getDb(customPath?: string): Promise<PGlite> {
    return await this.initializeDb(customPath)
  }

  /**
   * Close the database connection
   */
  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close()
      this.db = null
      console.log('PGlite database connection closed')
    }
  }

  /**
   * Get database information
   * @returns Database status and path
   */
  public getInfo(): { isConnected: boolean; path: string | null } {
    return {
      isConnected: this.db !== null,
      path: this.db ? this.getDefaultDbPath() : null,
    }
  }
}

/**
 * Convenience function to get PGlite database instance
 * @param customPath Optional custom database path
 * @returns PGlite instance
 */
export async function getPgLiteDb(customPath?: string): Promise<PGlite> {
  const server = PgLiteServer.getInstance()
  return await server.getDb(customPath)
}

/**
 * Convenience function to close the database connection
 */
export async function closePgLiteDb(): Promise<void> {
  const server = PgLiteServer.getInstance()
  await server.close()
}

/**
 * Get PGlite database information
 */
export function getPgLiteInfo(): { isConnected: boolean; path: string | null } {
  const server = PgLiteServer.getInstance()
  return server.getInfo()
}
