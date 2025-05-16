import { OpenAI } from 'openai'
import { AvailableModel, LLM_PROVIDER_INFO, LLMProviderType } from '@penx/types'

export async function fetchAvailableModels(
  apiKey: string,
  providerType: LLMProviderType,
  baseUrl?: string,
): Promise<AvailableModel[]> {
  if (!apiKey) {
    return []
  }
  const providerInfo = LLM_PROVIDER_INFO[providerType]
  const _baseUrl = baseUrl || providerInfo.baseUrl

  // Special handling for Google's API
  if (providerType === 'google') {
    try {
      const endpoint = `${_baseUrl}/models?key=${apiKey}`
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch Google models: ${response.statusText}`)
      }
      const data: any = await response.json()
      return data.models.map(
        (model: { name: string; displayName: string }) => ({
          id: model.name.split('/').pop() || model.name,
          label: model.name.split('/').pop() || model.displayName || model.name,
        }),
      )
    } catch (error) {
      console.error('Failed to fetch Google models:', error)
      return []
    }
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: _baseUrl,
    dangerouslyAllowBrowser: true,
  })

  try {
    const resp = await openai.models.list()
    return resp.data.map((model) => ({
      id: model.id,
      label: model.id,
    }))
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return []
  }
}
