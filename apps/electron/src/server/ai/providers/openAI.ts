import { createOpenAI } from '@ai-sdk/openai'
import { LanguageModelV1 } from '@ai-sdk/provider'
import { AICustomConfig } from '../../config/type'
import { AbstractProvider } from './abstractProvider'

export class OpenAIModelProvider extends AbstractProvider {
  constructor(globalConfig: AICustomConfig) {
    super(globalConfig)
  }

  createProvider() {
    return createOpenAI({
      apiKey: this.globalConfig.llmApiKey,
      baseURL: this.globalConfig.llmApiEndpoint || undefined,
    })
  }

  protected getLLM(): LanguageModelV1 {
    return this.provider.languageModel(
      this.globalConfig.languageModel ?? 'gpt-4.1-mini',
    )
  }
}
