import { getTrailingMessageId } from '@/lib/chat.utils'
import { createOpenAI } from '@ai-sdk/openai'
import { geolocation } from '@vercel/functions'
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai'
import { isProd } from '@penx/constants'
import { IMessage } from '@penx/model'
import { uniqueId } from '@penx/unique-id'
import { RequestHints, systemPrompt } from './prompts'

export const maxDuration = 60

type Input = {
  id: string
  selectedChatModel: string
  system: any
  provider: string
  message: {
    id: string
    createdAt: string
    role: 'system' | 'user' | 'assistant' | 'data'
    content: string
    parts: any[]
  }
}

export async function POST(request: Request) {
  const json: Input = await request.json()
  console.log('=======json:', json, json.message.parts)

  try {
    const { id, message, selectedChatModel, system } = json

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

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: createOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          })('gpt-4o-mini'),
          system: system,
          messages,
        })

        result.consumeStream()

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        })
      },
      onError: () => {
        return 'Oops, an error occurred!'
      },
    })
  } catch (_) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    })
  }
}
