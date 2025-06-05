import fs from 'fs'
import OpenAI from 'openai'

const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.laozhang.ai/v1',
  apiKey: 'sk-YtcaDM3AN4yINYd03d57214035Aa4bA0AcA0E408290fEa0e',
})

const filePath = '/Users/ziyi/Desktop/test.m4a'

async function init() {
  const fileStream = fs.createReadStream(filePath)

  try {
    const transcription = await openai.audio.transcriptions.create({
      model: 'gpt-4o-transcribe',
      file: fileStream,
      response_format: 'text',
      // language: 'zh',
      temperature: 0.2,
    })

    console.log('-------transcription:', transcription)
  } catch (error) {
    console.log('error:', error)
  }
}

init()
