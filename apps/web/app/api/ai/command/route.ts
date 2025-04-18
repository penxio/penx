import { getServerSession } from '@/lib/session'
import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { createDeepSeek, deepseek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createPerplexity, perplexity } from '@ai-sdk/perplexity'
import { PlanType } from '@penx/db/client'
import { convertToCoreMessages, streamText } from 'ai'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

enum AIProvider {
  OpenAI = 'OpenAI',
  DeepSeek = 'DeepSeek',
  Perplexity = 'Perplexity',
  Google = 'Google',
  Anthropic = 'Anthropic',
}

type Input = {
  provider: AIProvider
  apiKey: string
  messages: any
  model: string
  system: any
}

export async function POST(req: NextRequest) {
  const input = (await req.json()) as Input
  const session = await getServerSession()

  console.log('=======session:', session)

  if (session?.isLoggedIn !== true) {
    throw new Error('Unauthorized')
  }

  let planType = session?.planType

  if (
    session.currentPeriodEnd &&
    Date.now() > new Date(session.currentPeriodEnd).getTime()
  ) {
    planType = PlanType.FREE
  }

  const isPro = planType === PlanType.PRO
  // console.log('=====isPro:', isPro)

  if (!isPro) {
    throw new Error('This AI-assistant is for Pro users only.')
  }

  if (input.provider === AIProvider.Google) {
    console.log('google.....')
    const google = createGoogleGenerativeAI({
      apiKey: input.apiKey || process.env.GOOGLE_AI_API_KEY,
    })
    return generate(input, google('gemini-1.5-flash'))
  }

  if (input.provider === AIProvider.DeepSeek) {
    const deepseek = createDeepSeek({
      apiKey: input.apiKey || process.env.DEEPSEEK_API_KEY,
    })
    return generate(input, deepseek('deepseek-chat'))
  }

  if (input.provider === AIProvider.Anthropic) {
    console.log('claud...')
    const anthropic = createAnthropic({
      apiKey: input.apiKey || process.env.ANTHROPIC_API_KEY,
    })

    return generate(input, anthropic('claude-3-haiku-20240307'))
  }

  if (input.provider === AIProvider.OpenAI) {
    const openai = createOpenAI({
      apiKey: input.apiKey || process.env.OPENAI_API_KEY,
    })
    return generate(input, openai('gpt-4o-mini'))
  }

  if (input.provider === AIProvider.Perplexity) {
    console.log('pp...:', process.env.PERPLEXITY_API_KEY)
    const perplexity = createPerplexity({
      apiKey: input.apiKey || process.env.PERPLEXITY_API_KEY,
    })
    return generate(input, perplexity('sonar-pro'))
  }

  const deepseek = createDeepSeek({
    apiKey: input.apiKey || process.env.DEEPSEEK_API_KEY,
  })
  return generate(input, deepseek('deepseek-chat'))
}

async function generate(input: Input, llm: any) {
  const {
    provider = AIProvider.OpenAI,
    apiKey: key,
    messages,
    model = 'gpt-4o-mini',
    system,
  } = input

  // if (!apiKey) {
  //   return NextResponse.json(
  //     { error: 'Missing OpenAI API key.' },
  //     { status: 401 },
  //   )
  // }

  try {
    const result = streamText({
      maxTokens: 2048,
      messages: convertToCoreMessages(messages),
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
