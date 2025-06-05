import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET(req: NextRequest) {
  return NextResponse.json({
    hello: 'Hello, World!',
  })
}

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.laozhang.ai/v1',
  apiKey: 'sk-YtcaDM3AN4yINYd03d57214035Aa4bA0AcA0E408290fEa0e',
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('file')

    if (!(audioFile instanceof File)) {
      return NextResponse.json(
        { error: 'No audio file uploaded' },
        { status: 400 },
      )
    }

    console.log('======audioFile:', audioFile)

    const transcription = await openai.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file: audioFile,
      response_format: 'text',
      // language: 'zh', // 可选，指定语言为中文
      temperature: 0.2,
    })

    console.log('=====transcription:', transcription)

    return NextResponse.json({ text: transcription })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
