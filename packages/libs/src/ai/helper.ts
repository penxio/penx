import {
  AvailableModel,
  LLM_PROVIDER_INFO,
  LLMProviderType,
  LLMProviderTypeEnum,
} from '@penx/types'
import { upperFirst } from '@penx/utils'

export function getAvailableModels(
  providerType: LLMProviderType,
  baseUrl?: string,
): AvailableModel[] {
  const providerInfo = LLM_PROVIDER_INFO[providerType]
  const _baseUrl = baseUrl || providerInfo.baseUrl

  if (providerType === LLMProviderTypeEnum.PERPLEXITY) {
    return [
      'sonar-deep-research',
      'sonar-reasoning-pro',
      'sonar-reasoning',
      'sonar-pro',
      'sonar',
    ].map((i) => ({
      id: i,
      label: i
        .split('-')
        .map((i) => upperFirst(i))
        .join(' '),
    }))
  }

  if (providerType === LLMProviderTypeEnum.ANTHROPIC) {
    return [
      {
        id: 'claude-4-opus-20250514',
        label: 'Claude 4 Opus',
      },
      {
        id: 'claude-4-sonnet-20250514',
        label: 'Claude 4 Sonnet',
      },
      {
        id: 'claude-3-7-sonnet-20250219',
        label: 'Claude 3.7 Sonnet',
      },
      {
        id: 'claude-3-5-sonnet-latest',
        label: 'Claude 3.5 Sonnet',
      },
      {
        id: 'claude-3-5-haiku-latest',
        label: 'Claude 3.5 Haiku',
      },
    ]
  }

  if (providerType === LLMProviderTypeEnum.DEEPSEEK) {
    return [
      {
        id: 'deepseek-chat',
        label: 'Deepseek Chat',
      },
      {
        id: 'deepseek-reasoner',
        label: 'Deepseek Reasoner',
      },
    ]
  }

  if (providerType === LLMProviderTypeEnum.XAI) {
    return [
      {
        id: 'grok-4',
        label: 'Grok 4',
      },
      {
        id: 'grok-3-latest',
        label: 'Grok 3',
      },
      {
        id: 'grok-3-fast-latest',
        label: 'Grok 3 Fast',
      },
      {
        id: 'grok-3-mini-latest',
        label: 'Grok 3 Mini',
      },
      {
        id: 'grok-3-mini-fast-latest',
        label: 'Grok 3 Mini Fast',
      },
      {
        id: 'grok-2-vision',
        label: 'Grok 2 Vision',
      },
      {
        id: 'grok-2-latest',
        label: 'Grok 2',
      },
    ]
  }

  if (providerType === LLMProviderTypeEnum.GOOGLE) {
    return [
      {
        id: 'gemini-2.5-pro',
        label: 'Gemini 2.5 pro',
      },
      {
        id: 'gemini-2.5-flash',
        label: 'Gemini 2.5 Flash',
      },
      {
        id: 'gemini-2.5-flash-lite',
        label: 'Gemini 2.5 Flash Lite',
      },
      {
        id: 'gemini-2.5-pro-exp-03-25',
        label: 'Gemini 2.5 Pro',
      },
      {
        id: 'gemini-2.0-flash',
        label: 'Gemini 2.0 Flash',
      },
      {
        id: 'gemini-2.0-flash-lite',
        label: 'Gemini 2.0 Flash Lite',
      },
      {
        id: 'gemini-1.5-pro',
        label: 'Gemini 1.5 Pro',
      },
      {
        id: 'gemini-1.5-flash',
        label: 'Gemini 1.5 Flash',
      },
    ]
  }

  return [
    {
      id: 'gpt-4.5-preview',
      label: 'GPT 4.5 Preview',
    },
    {
      id: 'gpt-4.1',
      label: 'GPT 4.1',
    },
    {
      id: 'gpt-4.1-mini',
      label: 'GPT 4.1 Mini',
    },
    {
      id: 'gpt-4.1-nano',
      label: 'GPT 4.1 Nano',
    },
    {
      id: 'gpt-4o',
      label: 'GPT 4o',
    },
    {
      id: 'gpt-4o-mini',
      label: 'GPT 4o Mini',
    },
    {
      id: 'o3',
      label: 'o3',
    },
    {
      id: 'o3-mini',
      label: 'o3 mini',
    },
    {
      id: 'o1',
      label: 'o1',
    },
    {
      id: 'o1-mini',
      label: 'o1 mini',
    },
  ]
}
