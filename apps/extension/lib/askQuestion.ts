import { ILanguageModel, IPromptMessage } from '@/lib/chrome-ai-types'

export async function askQuestion(
  question: string,
): Promise<ReadableStream<string> | null> {
  let window: any = self
  const LanguageModel: ILanguageModel = window.LanguageModel

  const available = await LanguageModel.availability()

  if (available === 'unavailable') {
    console.error('Prompt API model unavailable, please check hardware and system requirements')
    throw new Error('Model unavailable')
  }

  const session = await LanguageModel.create({
    monitor(m) {
      m.addEventListener('downloadprogress', (e: any) => {
        // Display real-time percentage progress (0-100)
        const percent = Math.floor(e.loaded * 100)
        // Can be replaced with progress bar prompt
        console.log(`Gemini Nano download progress: ${percent}%`)
      })
    },
  })

  const params = await LanguageModel.params()

  const initialPrompts: IPromptMessage[] = [
    // { role: 'system', content: 'You are a professional legal assistant.' },
    // { role: 'user', content: 'Please answer my legal questions in professional but accessible language.' },
  ]

  const controller = new AbortController()

  const sessionWithContext = await LanguageModel.create({
    initialPrompts,
    topK: params.defaultTopK,
    temperature: params.defaultTemperature,
    signal: controller.signal,
  })

  try {
    // Dynamically concatenate user input
    // const result = await sessionWithContext.prompt([
    //   { role: 'user', content: question },
    // ])

    // console.log('Model response:', result)

    // return result

    const stream = sessionWithContext.promptStreaming(question)
    return stream
  } catch (e) {
    console.error('Prompt API call exception', e)
    return null
  }
}
