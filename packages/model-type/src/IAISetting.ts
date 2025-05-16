import { LLMProviderType } from '@penx/types'

export enum AIProviderType {
  PERPLEXITY = 'PERPLEXITY',
  DEEPSEEK = 'DEEPSEEK',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GOOGLE_AI = 'GOOGLE_AI',
  XAI = 'XAI',
}

export type AIProvider = {
  type: LLMProviderType
  apiKey?: string
  baseURL?: string
  availableModels?: string[]
  [key: string]: any
}

export interface EmbeddingConfig {
  providerType: LLMProviderType
  model: string
  dimensions?: number
  batchSize?: number
  chunkSize?: number
  chunkOverlap?: number
}

export type AISetting = {
  providers?: AIProvider[]
  embaddingEnabled?: boolean
  embedding?: EmbeddingConfig
}
