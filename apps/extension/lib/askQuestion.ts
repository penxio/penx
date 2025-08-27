import { ILanguageModel, IPromptMessage } from '@/lib/chrome-ai-types'

export async function askQuestion(
  question: string,
): Promise<ReadableStream<string> | null> {
  let window: any = self
  const LanguageModel: ILanguageModel = window.LanguageModel

  const available = await LanguageModel.availability()

  if (available === 'unavailable') {
    console.error('Prompt API 模型不可用，请检查硬件和系统要求')
    throw new Error('模型不可用')
  }

  const session = await LanguageModel.create({
    monitor(m) {
      m.addEventListener('downloadprogress', (e: any) => {
        // 显示实时百分比进度 (0-100)
        const percent = Math.floor(e.loaded * 100)
        // 可替换为进度条提示
        console.log(`Gemini Nano下载进度：${percent}%`)
      })
    },
  })

  const params = await LanguageModel.params()

  const initialPrompts: IPromptMessage[] = [
    // { role: 'system', content: '你是一名专业的法律助手。' },
    // { role: 'user', content: '请用专业但通俗的语言解答我的法律问题。' },
  ]

  const controller = new AbortController()

  const sessionWithContext = await LanguageModel.create({
    initialPrompts,
    topK: params.defaultTopK,
    temperature: params.defaultTemperature,
    signal: controller.signal,
  })

  try {
    // 动态拼接用户输入
    // const result = await sessionWithContext.prompt([
    //   { role: 'user', content: question },
    // ])

    // console.log('模型回答：', result)

    // return result

    const stream = sessionWithContext.promptStreaming(question)
    return stream
  } catch (e) {
    console.error('Prompt API调用异常', e)
    return null
  }
}
