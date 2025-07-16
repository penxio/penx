import { createTool } from '@mastra/core'
import type { QueryResult } from '@mastra/core/vector'
import { embed } from 'ai'
import z from 'zod'
import { AICustomConfig, PENX_EMBEDDING_INDEX_NAME } from '../../config/type'
import { VectorService } from '../../db/vectorService'
import { AIModelFactory } from '../aiModelFactory'

export const queryTextDescription = `The text query to search for in the vector database.
- ALWAYS provide a non-empty query string
- Must contain the user's question or search terms
- Example: "market data" or "financial reports"
- If the user's query is about a specific topic, use that topic as the queryText
- Cannot be an empty string
- Do not include quotes, just the text itself
- Required for all searches`

export const topKDescription = `Controls how many matching documents to return.
- ALWAYS provide a value
- If no value is provided, use the default (3)
- Must be a valid and positive number
- Cannot be NaN
- Uses provided value if specified
- Default: 3 results (use this if unsure)
- Higher values (like 20) provide more context
- Lower values (like 3) focus on best matches
- Based on query requirements`

export const baseSchema = {
  queryText: z.string().describe(queryTextDescription),
  topK: z.coerce.number().describe(topKDescription),
}

// Output schema includes `sources`, which exposes the full set of retrieved chunks (QueryResult objects)
// Each source contains all information needed to reference
// the original document, chunk, and similarity score.
export const outputSchema = z.object({
  // Array of metadata or content for compatibility with prior usage
  relevantContext: z.any(),
  // Array of full retrieval result objects
  sources: z.array(
    z.object({
      id: z.string(), // Unique chunk/document identifier
      metadata: z.any(), // All metadata fields (document ID, etc.)
      vector: z.array(z.number()), // Embedding vector (if available)
      score: z.number(), // Similarity score for this retrieval
      document: z.string(), // Full chunk/document text (if available)
    }),
  ),
})

export const vectorQueryTool = createTool({
  id: 'vectorQueryTool',
  description:
    'Access the knowledge base to find information needed to answer user questions.',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async (context) => {
    try {
      const embeddingModel =
        await AIModelFactory.getInstance().getEmbeddingModel()
      const config: AICustomConfig = AIModelFactory.getInstance().getConfig()
      const vectorService = VectorService.getInstance()
      const vectorStore = await vectorService.getVectorStore()

      console.log('context', context)
      console.log('embeddingModel', embeddingModel)
      console.log('context.query', context.query)

      const { embedding } = await embed({
        value: context.context.query,
        model: embeddingModel,
      })

      const results: QueryResult[] = await vectorStore.query({
        indexName: PENX_EMBEDDING_INDEX_NAME,
        queryVector: embedding,
        topK: config.embeddingTopK ?? 3,
      })

      return {
        sources: results.map((result) => ({
          id: result.id,
          vector: result.vector ?? [],
          score: result.score,
          document: result.document ?? '',
          metadata: result.metadata,
        })),
      }
    } catch (error) {
      throw error
    }
  },
  outputSchema,
})
