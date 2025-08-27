import { askQuestion } from '@/lib/askQuestion'
import { onMessage } from '@/lib/message'

export async function setupMessage() {
  console.log('====setupMessage....')

  onMessage('chromeAIPrompt', async () => {
    const stream = await askQuestion('在中国，强奸需要判几年？qing简短回答')
    // console.log('prompt........result:', stream)

    for await (const chunk of stream) {
      console.log('=====chunk:', chunk)
    }
  })
}
