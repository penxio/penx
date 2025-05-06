import { getTrailingMessageId } from '@/lib/chat.utils'
import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek, deepseek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createPerplexity, perplexity } from '@ai-sdk/perplexity'
import { geolocation } from '@vercel/functions'
import {
  appendClientMessage,
  appendResponseMessages,
  convertToCoreMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai'
import { NextResponse } from 'next/server'
import { isProd } from '@penx/constants'
import { AIProviderType, IMessage } from '@penx/model-type'
import { uniqueId } from '@penx/unique-id'
import { RequestHints, systemPrompt } from './prompts'

export const maxDuration = 60

type Input = {
  id: string
  selectedChatModel: string
  system: any
  provider: string
  apiKey: string
  baseURL: string
  message: {
    id: string
    createdAt: string
    role: 'system' | 'user' | 'assistant' | 'data'
    content: string
    parts: any[]
  }
}

export async function POST(request: Request) {
  const input: Input = await request.json()

  try {
    const { id, message, selectedChatModel, system } = input

    if (!input.apiKey) {
      throw new Error('Please provide an API key')
    }

    const previousMessages: any[] = []

    const messages = appendClientMessage({
      messages: previousMessages,
      message: {
        id: message.id,
        content: message.content,
        role: message.role,
      },
    })

    const { longitude, latitude, city, country } = geolocation(request)

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    }

    if (input.provider === AIProviderType.GOOGLE_AI) {
      const google = createGoogleGenerativeAI({
        apiKey: input.apiKey || process.env.GOOGLE_AI_API_KEY,
      })
      return generate(input, google('gemini-1.5-flash'))
    }

    if (input.provider === AIProviderType.DEEPSEEK) {
      const deepseek = createDeepSeek({
        apiKey: input.apiKey,
      })
      return generate(input, deepseek('deepseek-chat'))
    }

    if (input.provider === AIProviderType.ANTHROPIC) {
      const anthropic = createAnthropic({
        apiKey: input.apiKey,
      })

      return generate(input, anthropic('claude-3-haiku-20240307'))
    }

    if (input.provider === AIProviderType.OPENAI) {
      const openai = createOpenAI({
        apiKey: input.apiKey,
        baseURL: input.baseURL,
      })
      return generate(input, openai('gpt-4o-mini'))
    }

    if (input.provider === AIProviderType.PERPLEXITY) {
      console.log('pp...:', process.env.PERPLEXITY_API_KEY)
      const perplexity = createPerplexity({
        apiKey: input.apiKey,
      })
      return generate(input, perplexity('sonar-pro'))
    }
  } catch (error) {
    console.log('====error:', error)
    return new Response(
      error.message || 'An error occurred while processing your request!',
      {
        status: 500,
      },
    )
  }
}

async function generate(input: Input, llm: any) {
  const {
    provider = AIProviderType.OPENAI,
    apiKey: key,
    system,
    message,
  } = input

  const messages = appendClientMessage({
    messages: [],
    // messages: previousMessages,
    message: {
      id: message.id,
      content: message.content,
      role: message.role,
    },
  })

  try {
    const result = streamText({
      maxTokens: 2048,
      messages: messages,
      model: llm,
      system: system,
    })

    return result.toDataStreamResponse()
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 },
    )
  }
}
