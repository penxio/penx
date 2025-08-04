import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, embedMany, streamText } from 'ai'
import { Hono } from 'hono'

const app = new Hono()

app.post('/chat', async (c) => {
  const input = await c.req.json()
  const text = input.text as string
  const messages = input.message

  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // baseURL: process.env.OPENAI_BASE_URL || undefined,
  })

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
  })

  return result.toDataStreamResponse()
})

export default app
