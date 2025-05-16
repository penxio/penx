import { getTrailingMessageId } from '@/lib/chat.utils'
import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek, deepseek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createPerplexity, perplexity } from '@ai-sdk/perplexity'
import { geolocation } from '@vercel/functions'
import { appendClientMessage, streamText } from 'ai'
import { NextResponse } from 'next/server'
import { LLMProviderTypeEnum } from '@penx/types'
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
    const { id, message, provider, selectedChatModel, system } = input

    if (!provider) {
      throw new Error('Please select a provider')
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

    if (input.provider === LLMProviderTypeEnum.GOOGLE) {
      const google = createGoogleGenerativeAI({
        apiKey: input.apiKey || process.env.GOOGLE_AI_API_KEY,
      })
      return generate(
        input,
        google(input.selectedChatModel || 'gemini-1.5-flash'),
      )
    }

    if (input.provider === LLMProviderTypeEnum.DEEPSEEK) {
      const deepseek = createDeepSeek({
        apiKey: input.apiKey,
      })
      return generate(
        input,
        deepseek(input.selectedChatModel || 'deepseek-chat'),
      )
    }

    if (input.provider === LLMProviderTypeEnum.ANTHROPIC) {
      const anthropic = createAnthropic({
        apiKey: input.apiKey,
      })

      return generate(
        input,
        anthropic(input.selectedChatModel || 'claude-3-haiku-20240307'),
      )
    }

    if (
      input.provider === LLMProviderTypeEnum.OPENAI ||
      input.provider === LLMProviderTypeEnum.OPENAI_COMPATIBLE
    ) {
      const openai = createOpenAI({
        apiKey: input.apiKey,
        baseURL: input.baseURL,
      })
      return generate(input, openai(input.selectedChatModel || 'gpt-4o-mini'))
    }

    if (input.provider === LLMProviderTypeEnum.PERPLEXITY) {
      const perplexity = createPerplexity({
        apiKey: input.apiKey,
      })
      return generate(input, perplexity(input.selectedChatModel || 'sonar-pro'))
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
    provider = LLMProviderTypeEnum.OPENAI,
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
