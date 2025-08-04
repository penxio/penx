import { LLMProviderType } from '@penx/types';


export type AIProvider = {
  name?: string
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