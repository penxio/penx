import { createOpenAI } from '@ai-sdk/openai'
import { EmbeddingModelV1, LanguageModelV1, ProviderV1 } from '@ai-sdk/provider'
import { AICustomConfig } from '../../config/type'

export abstract class AbstractProvider {
  globalConfig: AICustomConfig
  provider!: ProviderV1
  protected ready: Promise<void>

  constructor(globalConfig: AICustomConfig) {
    this.globalConfig = globalConfig

    // Create and store the initialization promise
    this.ready = this.initialize().catch((error) => {
      console.error('Provider initialization failed:', error)
    })
  }

  async languageModel(modelId: string): Promise<LanguageModelV1> {
    await this.ready
    return this.provider.languageModel(modelId)
  }

  /**
   * Initialize the provider - this is called automatically by the constructor
   * Child classes should implement createProvider() to create their specific provider
   */
  private async initialize(): Promise<void> {
    this.provider = this.createProvider()
  }

  /**
   * Create the provider instance - to be implemented by child classes
   */
  protected abstract createProvider(): ProviderV1

  /**
   * Get the language model - wait for initialization to complete
   */
  async LLM(): Promise<LanguageModelV1> {
    await this.ready
    return this.getLLM()
  }

  /**
   * Actual implementation of LLM to be overridden by child classes
   */
  protected abstract getLLM(): LanguageModelV1

  /**
   * Get the embedding model - wait for initialization to complete
   */
  async Embeddings(): Promise<EmbeddingModelV1<string>> {
    await this.ready

    // Check if child class provides custom embeddings implementation
    if (this.getEmbeddings) {
      return this.getEmbeddings()
    }

    // Default implementation
    try {
      const config = {
        apiKey: this.globalConfig.embeddingApiKey,
        baseURL: this.globalConfig.embeddingApiEndpoint || undefined,
      }
      if (this.globalConfig.embeddingApiKey) {
        return createOpenAI(config).textEmbeddingModel(
          this.globalConfig.embeddingModel ?? 'text-embedding-3-small',
        )
      }
      return this.provider.textEmbeddingModel(
        this.globalConfig.embeddingModel ?? 'text-embedding-3-small',
      )
    } catch (error) {
      console.log(error, 'ERROR Create Embedding model')
      // throw error;
      return null as unknown as EmbeddingModelV1<string>
    }
  }

  /**
   * Optional custom embeddings implementation for child classes
   */
  protected getEmbeddings?(): EmbeddingModelV1<string>
}
