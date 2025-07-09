import { AbstractProvider } from './abstractProvider'
import { GlobalConfig } from '../type'
import { createOpenAI } from '@ai-sdk/openai'
import { LanguageModelV1 } from '@ai-sdk/provider'

export class OpenAIModelProvider extends AbstractProvider {
  constructor(globalConfig: GlobalConfig) {
    super(globalConfig)
  }

  createProvider() {
    return createOpenAI({
      apiKey: this.globalConfig.aiApiKey,
      baseURL: this.globalConfig.aiApiEndpoint || undefined
    })
  }

  protected getLLM(): LanguageModelV1 {
    return this.provider.languageModel(this.globalConfig.languageModel ?? 'gpt-4.1-mini')
  }
}
