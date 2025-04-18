import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { AiAnalyzer } from './ai-analyzer'
import { getPrompts } from './getPrompts'
import { ExtractResult } from './types'
import { webExtractor } from './web-extractor'

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url')

    // prompt,result
    const type = req.nextUrl.searchParams.get('type')
    const provider = req.nextUrl.searchParams.get('provider')!

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 },
      )
    }

    const extractResult = await webExtractor.extractPostDirectory(url)
    const { systemPrompt, prompt } = getPrompts(extractResult)

    if (
      !extractResult ||
      !extractResult.items ||
      extractResult.items.length === 0
    ) {
      return NextResponse.json(
        { error: 'No content found at the provided URL' },
        { status: 404 },
      )
    }

    if (type === 'prompt') {
      return new NextResponse(
        `
${systemPrompt}

${prompt}

        `,
        { headers: { 'Content-Type': 'text/plain' } },
      )
    }

    const ai = new AiAnalyzer(provider as any, extractResult)

    const post = await ai.extractPostDirectory()
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error generating text:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 },
    )
  }
}
