import { Hono } from 'hono'
import { ICreationNode } from '@penx/model-type'
import { AICustomConfig } from '../config/type'
import { initializeAI } from './aiModelFactory'
import { AIService } from './aiService'

const aiHonoServer = new Hono()

aiHonoServer.post('/config', async (c) => {
  const config = await c.req.json()
  initializeAI(config as AICustomConfig)
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

export default aiHonoServer
