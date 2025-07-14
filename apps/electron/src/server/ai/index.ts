import { Hono } from 'hono'
import { ICreationNode, NodeType } from '@penx/model-type'
import { CreationStatus, GateType } from '@penx/types'
import { AIModelFactory } from './aiModelFactory'
import { AIService } from './aiService'
import { GlobalConfig } from './type'

const aiHonoServer = new Hono()

// temporary config
const tempConfig: GlobalConfig = {
  dbPath: './data',
  llmProvider: 'openai',
  languageModel: 'gpt-4o-mini',
  embeddingProvider: 'openai',
  embeddingModel: 'text-embedding-3-small',
  embeddingDimensions: 1536,
  aiApiKey: 'sk-test',
  aiApiEndpoint: 'https://openai.com/v1',
  embeddingApiKey: 'sk-test',
  embeddingApiEndpoint: 'https://openai.com/v1',
}
AIModelFactory.initialize(tempConfig)

// Health check endpoint
aiHonoServer.get('/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'AI service is running',
    config: {
      llmProvider: tempConfig.llmProvider,
      embeddingProvider: tempConfig.embeddingProvider,
      models: {
        llm: tempConfig.languageModel,
        embedding: tempConfig.embeddingModel,
      },
    },
  })
})

// Embedding upsert for creation content (main endpoint)
aiHonoServer.post('/embedding/upsert', async (c) => {
  const data: ICreationNode = await c.req.json()
  await AIService.embeddingUpsert([data])
  return c.json({ status: 'ok' })
})

// General embedding search
aiHonoServer.get('/embedding/search', async (c) => {
  const query = c.req.query('query')
  if (!query) {
    return c.json({ error: 'Query is required' }, 400)
  }
  const results = await AIService.embeddingSearch(query)
  return c.json(results)
})

export default aiHonoServer
