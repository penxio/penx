export enum LLMProviderTypeEnum {
  OPENAI = 'openai',
  GOOGLE = 'google',
  DEEPSEEK = 'deepseek',
  XAI = 'xai',
  ANTHROPIC = 'anthropic',
  PERPLEXITY = 'perplexity',
  OPENAI_COMPATIBLE = 'openai-compatible',
}

export type LLMProviderType =
  | 'openai'
  | 'google'
  | 'deepseek'
  | 'xai'
  | 'anthropic'
  | 'perplexity'
  | 'openai-compatible'

export const ALL_PROVIDERS_RAW = [
  'openai',
  'google',
  'deepseek',
  'xai',
  'anthropic',
  'perplexity',
  'openai-compatible',
]

export const LLM_PROVIDER_INFO: Record<
  LLMProviderType,
  {
    name: string
    baseUrl: string
    urlForGettingApiKey?: string
  }
> = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
  },
  google: {
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta', // Or Vertex AI endpoint
    urlForGettingApiKey: 'https://aistudio.google.com/apikey',
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
  },
  xai: {
    name: 'xAI (Grok)',
    baseUrl: 'https://api.x.ai/v1',
    urlForGettingApiKey: 'https://docs.x.ai/docs/overview',
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
  },
  perplexity: {
    name: 'Perplexity AI',
    baseUrl: 'https://api.perplexity.ai',
  },
  'openai-compatible': {
    name: 'OpenAI Compatible',
    baseUrl: 'YOUR_COMPATIBLE_ENDPOINT', // User specific
  },
}

export interface AvailableModel {
  id: string
  label: string
}

export const ALL_PROVIDERS = Object.keys(
  LLM_PROVIDER_INFO,
).sort() as LLMProviderType[]
