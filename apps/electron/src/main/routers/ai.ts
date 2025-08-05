import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createPerplexity, perplexity } from '@ai-sdk/perplexity'
import { createXai } from '@ai-sdk/xai'
import { zValidator } from '@hono/zod-validator'
import { convertToCoreMessages, embedMany, streamText } from 'ai'
import { Hono } from 'hono'
import { z } from 'zod'
import { LLMProviderTypeEnum } from '@penx/types'

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
    const { type, model, messages } = input

    if (type === LLMProviderTypeEnum.OPENAI) {
      const openai = createOpenAI({ apiKey: input.apiKey })
      return generate(messages, openai(model))
    }

    if (type === LLMProviderTypeEnum.PERPLEXITY) {
      const perplexity = createPerplexity({ apiKey: input.apiKey })
      return generate(messages, perplexity(model))
    }

    if (type === LLMProviderTypeEnum.DEEPSEEK) {
      const deepseek = createDeepSeek({ apiKey: input.apiKey })
      return generate(messages, deepseek(model))
    }

    if (type === LLMProviderTypeEnum.ANTHROPIC) {
      const anthropic = createAnthropic({
        apiKey: input.apiKey,
      })

      return generate(messages, anthropic(model))
    }
    if (type === LLMProviderTypeEnum.GOOGLE) {
      const google = createGoogleGenerativeAI({
        apiKey: input.apiKey,
      })
      return generate(messages, google(model))
    }

    if (type === LLMProviderTypeEnum.XAI) {
      const xai = createXai({ apiKey: input.apiKey })
      return generate(messages, xai(model))
    }

    return c.json({ success: false })
  },
)

async function generate(messages: any[], llm: any) {
  const result = streamText({
    // maxTokens: 2048,
    messages: convertToCoreMessages(messages),
    model: llm,
    // system: system,
  })

  return result.toDataStreamResponse()
}

export default app
