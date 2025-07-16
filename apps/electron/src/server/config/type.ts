/**
 * AI Service Configuration Types and Schemas
 *
 * This module defines the configuration schema and types for the AI service,
 * including database paths, API endpoints, model configurations, and embedding settings.
 */

import { z } from 'zod'

export enum ProviderType {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
  LOCAL = 'local',
}

/**
 * AI Server Configuration Schema
 * Defines the structure and validation for AI-related settings
 */
export const ConfigSchema = z.object({
  enable: z.boolean().optional(),

  // Language Model Configuration
  llmProvider: z.string().optional(), // Provider for language model (openai, anthropic, etc.)
  llmApiKey: z.string().optional(), // API key for language model
  llmApiEndpoint: z.string().optional(), // API endpoint for language model
  languageModel: z.string().optional(), // Language model identifier

  // Embedding Model Configuration (can be different provider)
  embeddingProvider: z.string().optional(), // Provider for embedding model
  embeddingModel: z.string().optional(), // Embedding model identifier
  embeddingDimensions: z.number().optional(), // Vector dimensions (e.g., 1536)
  embeddingApiEndpoint: z.string().optional(), // Embedding API endpoint
  embeddingApiKey: z.string().optional(), // Embedding API key
  embeddingTopK: z.number().optional(), // Number of top results to return

  // Rerank Settings
  rerankModel: z.string().optional(), // Rerank model identifier
  rerankTopK: z.number().optional(), // Number of top results to rerank
  rerankScore: z.number().optional(), // Minimum rerank score threshold
  rerankUseEembbingEndpoint: z.boolean().optional(), // Use embedding endpoint for rerank
})

/**
 * Global AI Configuration Type
 * Inferred from ConfigSchema for type safety
 */
export type AICustomConfig = z.infer<typeof ConfigSchema>

export const PENX_EMBEDDING_INDEX_NAME = 'penx_embedding'
