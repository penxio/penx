import { QueryResult } from '@mastra/core'
import { embed, embedMany } from 'ai'
import { INode } from '@penx/model-type'
import { VectorService } from '../db/vectorService'
import { AIModelFactory } from './aiModelFactory'
import { buildMDocument, ProcessingOptions } from './utils/nodeToDocument'

/**
 * AI Service - Business logic layer for AI operations
 * Responsibilities:
 * - Coordinate AI models and vector operations
 * - Handle embedding generation and search
 * - Process business data (INode) into AI-ready format
 */
export class AIService {
  /**
   * Clear all embeddings from the index
   */
  static async embeddingDeleteAll(indexName: string = 'penx_embedding') {
    const vectorService = VectorService.getInstance()
    await vectorService.clearEmbeddingIndex(indexName)
  }

  /**
   * Process and upsert embeddings for node data
   * Business logic: Convert INode[] -> embeddings -> vector store
   */
  static async embeddingUpsert(data: INode[], options?: ProcessingOptions) {
    // 1. Get AI services
    const embeddingModel =
      await AIModelFactory.getInstance().getEmbeddingModel()
    const vectorService = VectorService.getInstance()
    const vectorStore = await vectorService.getVectorStore()

    // 2. Process business data into documents
    const documents = await buildMDocument(data, options)
    const chunks = await documents.chunk()

    // 3. Generate embeddings
    const { embeddings } = await embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: embeddingModel,
    })

    // 4. Ensure index exists
    await vectorService.ensureEmbeddingIndex('penx_embedding', 1536)

    // 5. Store embeddings
    await vectorStore.upsert({
      indexName: 'penx_embedding',
      vectors: embeddings,
      metadata: chunks.map((chunk) => ({
        text: chunk.text,
        id: chunk.id_,
        // Preserve all metadata from the original document
        ...chunk.metadata,
      })),
    })
  }

  /**
   * Search embeddings with text query
   */
  static async embeddingSearch(
    query: string,
    topK: number = 10,
  ): Promise<QueryResult[]> {
    // 1. Get AI services
    const embeddingModel =
      await AIModelFactory.getInstance().getEmbeddingModel()
    const vectorService = VectorService.getInstance()
    const vectorStore = await vectorService.getVectorStore()

    // 2. Generate query embedding
    const { embedding } = await embed({
      value: query,
      model: embeddingModel,
    })

    // 3. Search vectors
    const results = await vectorStore.query({
      indexName: 'penx_embedding',
      queryVector: embedding,
      topK,
    })

    return results
  }

  /**
   * Search embeddings with creation-specific filtering
   */
  static async embeddingSearchCreations(
    query: string,
    filters?: {
      creationType?: string
      creationStatus?: string
      userId?: string
      siteId?: string
      featured?: boolean
    },
    topK: number = 10,
  ): Promise<QueryResult[]> {
    // 1. Get AI services
    const embeddingModel =
      await AIModelFactory.getInstance().getEmbeddingModel()
    const vectorService = VectorService.getInstance()
    const vectorStore = await vectorService.getVectorStore()

    // 2. Generate query embedding
    const { embedding } = await embed({
      value: query,
      model: embeddingModel,
    })

    // 3. Build filter with creation-specific constraints
    const searchFilter = filters
      ? {
          ...filters,
          nodeType: 'CREATION', // Ensure we only get creation nodes
        }
      : { nodeType: 'CREATION' }

    // 4. Search vectors with filters
    const results = await vectorStore.query({
      indexName: 'penx_embedding',
      queryVector: embedding,
      topK,
      filter: searchFilter,
    })

    return results
  }

  /**
   * Get embedding index statistics
   */
  static async getEmbeddingStats(indexName: string = 'penx_embedding') {
    const vectorService = VectorService.getInstance()
    return await vectorService.getIndexStats(indexName)
  }
}
