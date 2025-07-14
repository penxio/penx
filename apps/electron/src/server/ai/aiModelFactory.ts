import { EmbeddingModelV1, LanguageModelV1 } from '@ai-sdk/provider'
import { AbstractProvider } from './providers/abstractProvider'
import { OpenAIModelProvider } from './providers/openAI'
import { GlobalConfig, ProviderType } from './type'
import { PgLiteVector } from './vector'

export class AIModelFactory {
  private static instance: AIModelFactory
  private llmProviderCache = new Map<string, AbstractProvider>()
  private embeddingProviderCache = new Map<string, AbstractProvider>()
  private vectorInstance?: PgLiteVector
  private globalConfig: GlobalConfig

  private constructor(config: GlobalConfig) {
    this.globalConfig = config
  }

  /**
   * Initialize the singleton instance with configuration
   * This should be called once at app startup
   */
  static initialize(config: GlobalConfig): AIModelFactory {
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
  getConfig(): GlobalConfig {
    return this.globalConfig
  }

  /**
   * Update configuration and clear caches
   */
  updateConfig(config: GlobalConfig): void {
    this.globalConfig = config
    this.clearCache()
  }

  /**
   * Factory method to create AI providers based on type
   */
  private createProvider(
    type: ProviderType,
    config: GlobalConfig,
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
    const providerType = this.globalConfig.llmProvider || 'openai'
    const cacheKey = `llm-${providerType}-${JSON.stringify({
      apiKey: this.globalConfig.aiApiKey,
      apiEndpoint: this.globalConfig.aiApiEndpoint,
      model: this.globalConfig.languageModel,
    })}`

    if (!this.llmProviderCache.has(cacheKey)) {
      const provider = this.createProvider(
        providerType as ProviderType,
        this.globalConfig,
      )
      this.llmProviderCache.set(cacheKey, provider)
    }

    return this.llmProviderCache.get(cacheKey)!
  }

  /**
   * Get or create an embedding provider instance with caching
   */
  async getEmbeddingProvider(): Promise<AbstractProvider> {
    const providerType = this.globalConfig.embeddingProvider || 'openai'
    const cacheKey = `embedding-${providerType}-${JSON.stringify({
      apiKey: this.globalConfig.embeddingApiKey,
      apiEndpoint: this.globalConfig.embeddingApiEndpoint,
      model: this.globalConfig.embeddingModel,
    })}`

    if (!this.embeddingProviderCache.has(cacheKey)) {
      // Create a config specifically for embedding provider
      const embeddingConfig: GlobalConfig = {
        ...this.globalConfig,
        aiApiKey:
          this.globalConfig.embeddingApiKey || this.globalConfig.aiApiKey,
        aiApiEndpoint:
          this.globalConfig.embeddingApiEndpoint ||
          this.globalConfig.aiApiEndpoint,
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
   * Facade method: Get vector database instance
   */
  async getVectorDatabase(): Promise<PgLiteVector> {
    if (!this.vectorInstance) {
      this.vectorInstance = new PgLiteVector({
        dataDir: this.globalConfig.dbPath,
        schemaName: this.globalConfig.vectorSchemaName,
      })
    }

    return this.vectorInstance
  }

  /**
   * Clear provider cache
   */
  clearCache(): void {
    this.llmProviderCache.clear()
    this.embeddingProviderCache.clear()
    this.vectorInstance = undefined
  }

  /**
   * Get available provider types
   */
  getAvailableProviders(): ProviderType[] {
    return Object.values(ProviderType)
  }
}

// Convenience functions for easy access
export function initializeAI(config: GlobalConfig): AIModelFactory {
  return AIModelFactory.initialize(config)
}

export function getAI(): AIModelFactory {
  return AIModelFactory.getInstance()
}

// Legacy function - now just delegates to getInstance
export function createAIModelFactory(config: GlobalConfig): AIModelFactory {
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

export async function getVectorDatabase(): Promise<PgLiteVector> {
  return AIModelFactory.getInstance().getVectorDatabase()
}
