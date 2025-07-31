import OpenAI from 'openai'
import {
  defaultEditorContent,
  isMobileApp,
  Prompt,
  ROOT_HOST,
} from '@penx/constants'

export function getOpenAIClient() {
  const client = new OpenAI({
    apiKey: 'sk-xxx',
    // baseURL: 'http://localhost:4000/api/ai',
    baseURL: `${ROOT_HOST}/api/ai`,
    dangerouslyAllowBrowser: true,
  })
  return client
}
