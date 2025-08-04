import { createOpenAI } from '@ai-sdk/openai'
import { zValidator } from '@hono/zod-validator'
import { convertToCoreMessages, embedMany, streamText } from 'ai'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

app.post(
  '/chat',
  zValidator(
    'json',
    z.object({
      id: z.string(),
      messages: z.array(z.any()),
      requestBody: z.any(),
      type: z.string(),
      model: z.string(),
      apiKey: z.string(),
      baseURL: z.string().optional(),
    }),
  ),
  async (c) => {
    const input = c.req.valid('json')
    console.log('chat........', 'input:', input)
    const messages = input.messages

    const openai = createOpenAI({
      apiKey: input.apiKey,
      baseURL: input.baseURL || undefined,
    })

    const result = streamText({
      model: openai(input.model),
      messages: convertToCoreMessages(messages),
    })

    return result.toDataStreamResponse()
  },
)

export default app
