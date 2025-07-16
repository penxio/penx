import { QueryResult } from '@mastra/core'
import { embed, embedMany } from 'ai'
import { INode } from '@penx/model-type'
import { AICustomConfig, PENX_EMBEDDING_INDEX_NAME } from '../config/type'
import { VectorService } from '../db/vectorService'
import getChatAgent from './agent/chatAgent'
import getRagChatAgent from './agent/ragChatAgent'
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
  // Rebuild vector index
  static async rebuildVectorIndex() {
    const vectorService = VectorService.getInstance()
    const config: AICustomConfig = AIModelFactory.getInstance().getConfig()
    const embeddingDimension: number = config.embeddingDimensions ?? 1536
    await vectorService.clearEmbeddingIndex(PENX_EMBEDDING_INDEX_NAME)
    await vectorService.deleteVectorIndex(PENX_EMBEDDING_INDEX_NAME)
    await vectorService.ensureEmbeddingIndex(
      PENX_EMBEDDING_INDEX_NAME,
      embeddingDimension,
    )
  }

  /**
   * Clear all embeddings from the index
   */
  static async embeddingDeleteAll() {
    const vectorService = VectorService.getInstance()
    await vectorService.clearEmbeddingIndex(PENX_EMBEDDING_INDEX_NAME)
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
   * Get embedding index statistics
   */
  static async getEmbeddingStats(indexName: string = 'penx_embedding') {
    const vectorService = VectorService.getInstance()
    return await vectorService.getIndexStats(indexName)
  }

  static async chat(message: string) {
    const model = await AIModelFactory.getInstance().getLanguageModel()
    const agent = getChatAgent({
      model,
    })
    return await agent.generate(message)
  }

  static async ragChat(message: string) {
    const model = await AIModelFactory.getInstance().getLanguageModel()
    const agent = getRagChatAgent({
      model,
    })
    return await agent.generate(message)
  }
}
