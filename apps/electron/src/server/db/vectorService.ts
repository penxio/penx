import { PGlite } from '@electric-sql/pglite'
import { getPgLiteDb } from './index'
import { PgLiteVector } from './vector'

export class VectorService {
  private static instance: VectorService | null = null
  private vectorStore: PgLiteVector | null = null

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton VectorService instance
   */
  public static getInstance(): VectorService {
    if (!VectorService.instance) {
      VectorService.instance = new VectorService()
    }
    return VectorService.instance
  }

  /**
   * Initialize vector store with PGlite database
   */
  private async initializeVectorStore(): Promise<PgLiteVector> {
    if (this.vectorStore) {
      return this.vectorStore
    }

    // Get PGlite database instance
    const db: PGlite = await getPgLiteDb()

    // Create vector store instance
    this.vectorStore = new PgLiteVector(db)

    return this.vectorStore
  }

  /**
   * Get vector store instance
   */
  public async getVectorStore(): Promise<PgLiteVector> {
    return await this.initializeVectorStore()
  }

  /**
   * Create embedding index if not exists
   */
  public async ensureEmbeddingIndex(
    indexName: string = 'penx_embedding',
    dimension: number = 1536,
  ): Promise<void> {
    const vectorStore = await this.getVectorStore()
    await vectorStore.createIndex({
      indexName,
      dimension,
    })
  }

  /**
   * Clear all data from embedding index
   */
  public async clearEmbeddingIndex(
    indexName: string = 'penx_embedding',
  ): Promise<void> {
    const vectorStore = await this.getVectorStore()
    await vectorStore.truncateIndex({ indexName })
  }

  /**
   * Get vector store statistics
   */
  public async getIndexStats(indexName: string = 'penx_embedding') {
    const vectorStore = await this.getVectorStore()
    return await vectorStore.describeIndex({ indexName })
  }
}

// Convenience functions
export async function getVectorService(): Promise<VectorService> {
  return VectorService.getInstance()
}

export async function getVectorStore(): Promise<PgLiteVector> {
  const service = VectorService.getInstance()
  return await service.getVectorStore()
}
