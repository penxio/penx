import { FeatureExtractionPipeline } from '@xenova/transformers'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { db } from '@penx/db/client'
import { embeddings } from '@penx/db/schema'
import { createEmbeddings } from './createEmbeddings'

export interface RetrieveOptions {
  /** Query text */
  query: string
  /** Number of results to return, defaults to 4 */
  limit?: number
  /** Similarity threshold, defaults to 0.5 (higher values mean more similar, range 0-1) */
  threshold?: number
  /** Whether to include vector data, defaults to false */
  includeEmbedding?: boolean
}

export interface RetrieveResult {
  id: string
  nodeId: string | null
  metadata: any
  content?: string
  similarity: number
  embedding?: number[]
}

/**
 * Generate vector embedding for a single text
 * @param extractor Loaded model
 * @param value Text to embed
 * @returns Vector embedding array
 */
export const generateEmbedding = async (
  extractor: FeatureExtractionPipeline,
  value: string,
): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ').trim()
  const { embeddings: embeddingList } = await createEmbeddings(extractor, input)
  return embeddingList[0]
}

/**
 * Find relevant content based on query text (implementation based on AI SDK guide)
 * @param extractor Loaded model
 * @param userQuery User query text
 * @param limit Number of results to return, defaults to 4
 * @param threshold Similarity threshold, defaults to 0.5
 * @returns List of matching records, sorted by similarity
 */
export const findRelevantContent = async (
  extractor: FeatureExtractionPipeline,
  userQuery: string,
  limit: number = 4,
  threshold: number = 0.5,
) => {
  try {
    // 1. Generate query vector
    const userQueryEmbedded = await generateEmbedding(extractor, userQuery)

    // 2. Use Drizzle ORM's cosineDistance to calculate similarity
    // Note: cosineDistance returns distance (smaller means more similar), we calculate 1 - distance to get similarity (larger means more similar)
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      userQueryEmbedded,
    )})`

    // 3. Query database
    const results = await db
      .select({
        id: embeddings.id,
        nodeId: embeddings.nodeId,
        metadata: embeddings.metadata,
        similarity,
      })
      .from(embeddings)
      .where(gt(similarity, threshold))
      .orderBy(desc(similarity))
      .limit(limit)

    return results
  } catch (error) {
    console.error('Vector search query failed:', error)
    throw new Error(
      `Vector search failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Query matching embedding records based on text (new version, using AI SDK recommended method)
 * @param extractor Loaded model
 * @param options Query options
 * @returns List of matching records, sorted by similarity
 */
export async function retrieve(
  extractor: FeatureExtractionPipeline,
  options: RetrieveOptions,
): Promise<RetrieveResult[]> {
  const {
    query,
    limit = 4,
    threshold = 0.5,
    includeEmbedding = false,
  } = options

  try {
    // Use the new search method
    const results = await findRelevantContent(
      extractor,
      query,
      limit,
      threshold,
    )

    // If embedding vectors are needed, query again to retrieve them
    if (includeEmbedding && results.length > 0) {
      const idsToFetch = results.map((r) => r.id)
      const withEmbeddings = await db
        .select({
          id: embeddings.id,
          embedding: embeddings.embedding,
        })
        .from(embeddings)
        .where(sql`${embeddings.id} = ANY(${idsToFetch})`)

      const embeddingMap = new Map(
        withEmbeddings.map((e) => [e.id, e.embedding]),
      )

      return results.map((result) => ({
        ...result,
        embedding: embeddingMap.get(result.id),
      })) as RetrieveResult[]
    }

    return results.map((result) => ({
      ...result,
    })) as RetrieveResult[]
  } catch (error) {
    console.error('Vector search query failed:', error)
    throw new Error(
      `Vector search failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Simplified query function that only requires query text
 * @param extractor Loaded model
 * @param query Query text
 * @param limit Number of results to return, defaults to 4
 * @returns List of matching records
 */
export async function simpleRetrieve(
  extractor: FeatureExtractionPipeline,
  query: string,
  limit: number = 4,
): Promise<RetrieveResult[]> {
  return retrieve(extractor, { query, limit })
}

/**
 * Find the most similar single record
 * @param extractor Loaded model
 * @param query Query text
 * @param threshold Similarity threshold, defaults to 0.5
 * @returns Most similar record, or null if none found
 */
export async function findMostSimilar(
  extractor: FeatureExtractionPipeline,
  query: string,
  threshold: number = 0.5,
): Promise<RetrieveResult | null> {
  const results = await retrieve(extractor, { query, limit: 1, threshold })
  return results.length > 0 ? results[0] : null
}

/**
 * Direct simplified interface using findRelevantContent (recommended)
 * This function is closer to the implementation in the AI SDK guide
 * @param extractor Loaded model
 * @param query Query text
 * @param limit Number of results to return, defaults to 4
 * @param threshold Similarity threshold, defaults to 0.5
 * @returns List of matching records
 */
export async function searchSimilarContent(
  extractor: FeatureExtractionPipeline,
  query: string,
  limit: number = 4,
  threshold: number = 0.5,
) {
  return findRelevantContent(extractor, query, limit, threshold)
}
