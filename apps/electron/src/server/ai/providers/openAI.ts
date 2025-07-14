import { createOpenAI } from '@ai-sdk/openai'
import { LanguageModelV1 } from '@ai-sdk/provider'
import { GlobalConfig } from '../type'
import { AbstractProvider } from './abstractProvider'

export class OpenAIModelProvider extends AbstractProvider {
  constructor(globalConfig: GlobalConfig) {
    super(globalConfig)
  }

  createProvider() {
    return createOpenAI({
      apiKey: this.globalConfig.aiApiKey,
      baseURL: this.globalConfig.aiApiEndpoint || undefined,
    })
  }

  protected getLLM(): LanguageModelV1 {
    return this.provider.languageModel(
      this.globalConfig.languageModel ?? 'gpt-4.1-mini',
    )
  }
}
