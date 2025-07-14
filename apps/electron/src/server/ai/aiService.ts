import { QueryResult } from '@mastra/core'
import { embed, embedMany } from 'ai'
import { INode } from '@penx/model-type'
import { AIModelFactory } from './aiModelFactory'
import { buildMDocument, ProcessingOptions } from './utils/nodeToDocument'
import { PgLiteVector } from './vector'

export class AIService {
  static async embeddingDeleteAll(VectorStore: PgLiteVector) {
    await VectorStore.truncateIndex({ indexName: 'penx_embedding' })
  }

  /**
   * Upsert embeddings for ICreationNode data with optimized processing
   */
  static async embeddingUpsert(data: INode[], options?: ProcessingOptions) {
    const embeddingModel =
      await AIModelFactory.getInstance().getEmbeddingModel()
    const VectorStore = await AIModelFactory.getInstance().getVectorDatabase()

    const documents = await buildMDocument(data, options)
    const chunks = await documents.chunk()

    const { embeddings } = await embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: embeddingModel,
    })

    await VectorStore.createIndex({
      indexName: 'penx_embedding',
      dimension: 1536,
    })

    await VectorStore.upsert({
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

  static async embeddingSearch(query: string): Promise<QueryResult[]> {
    const embeddingModel =
      await AIModelFactory.getInstance().getEmbeddingModel()
    const VectorStore = await AIModelFactory.getInstance().getVectorDatabase()

    const { embedding } = await embed({
      value: query,
      model: embeddingModel,
    })

    const results = await VectorStore.query({
      indexName: 'penx_embedding',
      queryVector: embedding,
      topK: 10,
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
  ): Promise<QueryResult[]> {
    const embeddingModel =
      await AIModelFactory.getInstance().getEmbeddingModel()
    const VectorStore = await AIModelFactory.getInstance().getVectorDatabase()

    const { embedding } = await embed({
      value: query,
      model: embeddingModel,
    })

    const results = await VectorStore.query({
      indexName: 'penx_embedding',
      queryVector: embedding,
      topK: 10,
      // Add metadata filters if supported by your vector store
      filter: filters
        ? {
            ...filters,
            nodeType: 'CREATION', // Ensure we only get creation nodes
          }
        : { nodeType: 'CREATION' },
    })

    return results
  }
}
