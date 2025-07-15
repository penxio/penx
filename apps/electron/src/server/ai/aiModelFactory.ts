import { EmbeddingModelV1, LanguageModelV1 } from '@ai-sdk/provider'
import { AICustomConfig, ProviderType } from '../config/type'
import { AbstractProvider } from './providers/abstractProvider'
import { OpenAIModelProvider } from './providers/openAI'

export class AIModelFactory {
  private static instance: AIModelFactory
  private llmProviderCache = new Map<string, AbstractProvider>()
  private embeddingProviderCache = new Map<string, AbstractProvider>()
  private config: AICustomConfig

  private constructor(config: AICustomConfig) {
    this.config = config
  }

  /**
   * Initialize the singleton instance with configuration
   * This should be called once at app startup
   */
  static initialize(config: AICustomConfig): AIModelFactory {
    AIModelFactory.instance = new AIModelFactory(config)
    return AIModelFactory.instance
  }

  /**
   * Get the singleton instance
   * Will throw error if not initialized
   */
  static getInstance(): AIModelFactory {
    if (!AIModelFactory.instance) {
      throw new Error(
        'AIModelFactory not initialized. Call AIModelFactory.initialize(config) first.',
      )
    }
    return AIModelFactory.instance
  }

  /**
   * Check if factory is initialized
   */
  static isInitialized(): boolean {
    return !!AIModelFactory.instance
  }

  /**
   * Get current configuration
   */
  getConfig(): AICustomConfig {
    return this.config
  }

  /**
   * Update configuration and clear caches
   */
  updateConfig(config: AICustomConfig): void {
    this.config = config
    this.clearCache()
  }

  /**
   * Factory method to create AI providers based on type
   */
  private createProvider(
    type: ProviderType,
    config: AICustomConfig,
  ): AbstractProvider {
    switch (type) {
      case ProviderType.OPENAI:
        return new OpenAIModelProvider(config)
      default:
        throw new Error(`Unsupported provider type: ${type}`)
    }
  }

  /**
   * Get or create a LLM provider instance with caching
   */
  async getLLMProvider(): Promise<AbstractProvider> {
    const providerType = this.config.llmProvider || 'openai'
    const cacheKey = `llm-${providerType}-${JSON.stringify({
      apiKey: this.config.llmApiKey,
      apiEndpoint: this.config.llmApiEndpoint,
      model: this.config.languageModel,
    })}`

    if (!this.llmProviderCache.has(cacheKey)) {
      const provider = this.createProvider(
        providerType as ProviderType,
        this.config,
      )
      this.llmProviderCache.set(cacheKey, provider)
    }

    return this.llmProviderCache.get(cacheKey)!
  }

  /**
   * Get or create an embedding provider instance with caching
   */
  async getEmbeddingProvider(): Promise<AbstractProvider> {
    const providerType = this.config.embeddingProvider || 'openai'
    const cacheKey = `embedding-${providerType}-${JSON.stringify({
      apiKey: this.config.embeddingApiKey,
      apiEndpoint: this.config.embeddingApiEndpoint,
      model: this.config.embeddingModel,
    })}`

    if (!this.embeddingProviderCache.has(cacheKey)) {
      // Create a config specifically for embedding provider
      const embeddingConfig: AICustomConfig = {
        ...this.config,
        embeddingApiKey: this.config.embeddingApiKey,
        embeddingApiEndpoint: this.config.embeddingApiEndpoint,
      }

      const provider = this.createProvider(
        providerType as ProviderType,
        embeddingConfig,
      )
      this.embeddingProviderCache.set(cacheKey, provider)
    }

    return this.embeddingProviderCache.get(cacheKey)!
  }

  /**
   * Facade method: Get language model
   */
  async getLanguageModel(): Promise<LanguageModelV1> {
    const provider = await this.getLLMProvider()
    return provider.LLM()
  }

  /**
   * Facade method: Get embedding model
   */
  async getEmbeddingModel(): Promise<EmbeddingModelV1<string>> {
    const provider = await this.getEmbeddingProvider()
    return provider.Embeddings()
  }

  /**
   * Clear provider cache
   */
  clearCache(): void {
    this.llmProviderCache.clear()
    this.embeddingProviderCache.clear()
  }

  /**
   * Get available provider types
   */
  getAvailableProviders(): ProviderType[] {
    return Object.values(ProviderType)
  }
}

// Convenience functions for easy access
export function initializeAI(config: AICustomConfig): AIModelFactory {
  return AIModelFactory.initialize(config)
}

export function getAI(): AIModelFactory {
  return AIModelFactory.getInstance()
}

// Legacy function - now just delegates to getInstance
export function createAIModelFactory(config: AICustomConfig): AIModelFactory {
  if (AIModelFactory.isInitialized()) {
    const factory = AIModelFactory.getInstance()
    factory.updateConfig(config)
    return factory
  }
  return AIModelFactory.initialize(config)
}

// Static convenience methods for direct access
export async function getLanguageModel(): Promise<LanguageModelV1> {
  return AIModelFactory.getInstance().getLanguageModel()
}

export async function getEmbeddingModel(): Promise<EmbeddingModelV1<string>> {
  return AIModelFactory.getInstance().getEmbeddingModel()
}
