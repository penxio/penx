import { openai } from '@ai-sdk/openai'
import { Hono } from 'hono'
import { ICreationNode } from '@penx/model-type'
import { AICustomConfig } from '../config/type'
import getChatAgent from './agent/chatAgent'
import { initializeAI } from './aiModelFactory'
import { AIService } from './aiService'

const aiHonoServer = new Hono()

aiHonoServer.post('/config', async (c) => {
  const config = await c.req.json()
  initializeAI(config as AICustomConfig)
  return c.json({ status: 'ok' })
})

// Rebuild vector index
aiHonoServer.post('/rebuild-vector-index', async (c) => {
  await AIService.rebuildVectorIndex()
  return c.json({ status: 'ok' })
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

aiHonoServer.post('/chat', async (c) => {
  const { message } = await c.req.json()
  const result = await AIService.chat(message)
  return c.json(result)
})

aiHonoServer.post('/rag-chat', async (c) => {
  const { message } = await c.req.json()
  const result = await AIService.ragChat(message)
  return c.json(result)
})

export default aiHonoServer
