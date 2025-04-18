import { deepseek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'
import { getPrompts } from './getPrompts'
import { ExtractResult, PostDirectoryResult } from './types'

export class AiAnalyzer {
  constructor(
    private provider:
      | 'manually'
      | 'deepseek'
      | 'perplexity'
      | 'cloudflare'
      | 'openai' = 'deepseek',
    private extractResult: ExtractResult,
  ) {}

  getPostManually() {
    // console.log('====this.extractResult.items:', this.extractResult.items)

    // console.log('======items:', this.extractResult.items)

    const items = this.extractResult.items.filter((item) => {
      try {
        const url = new URL(item.href)
        const pathname = url.pathname
        // console.log(
        //   '=====url.protocol:',
        //   `${url.protocol}//` + url.host,
        // )

        if (!item.href.startsWith(`${url.protocol}//` + url.host)) {
          return false
        }
        // console.log('>>>>>>>>>>>pathname:', pathname)

        if (
          item.title === '' ||
          ['继续阅读', '下一页', '上一页', 'Next', 'Previous'].includes(
            item.title,
          ) ||
          pathname === '/' ||
          pathname.startsWith('/atom.xml') ||
          pathname.startsWith('/feed.xml') ||
          pathname.startsWith('/rss.xml') ||
          pathname.startsWith('/u/') ||
          /^(\/.{1,})?\/index?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/archives?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/guestbook\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/contributes?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/writings?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/photos?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/posts?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/thoughts?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/links?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/projects?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/albums?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/uses?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/sitemaps?\/?(.xml)?$/.test(pathname) ||
          /^(\/.{1,})?\/wp-sitemaps?\/?(.xml)?$/.test(pathname) ||
          /^(\/.{1,})?\/copyright\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/contacts?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/privacy\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/categories\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/articles?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/timelines?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/imprints?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/search?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/now?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/twitter\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/category\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/category\//.test(pathname) ||
          /^(\/.{1,})?\/categories\//.test(pathname) ||
          /^(\/.{1,})?\/tags?\//.test(pathname) ||
          /^(\/.{1,})?\/tags\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/rss\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/rrs\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/feed\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/atom\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/about\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/docs\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/wiki\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/friends?\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/plugins\/?(.html)?$/.test(pathname) ||
          /^(\/.{1,})?\/pages?\/.{1,}\/?$/.test(pathname) ||
          /^(\/.{1,})?\/status\/.{1,}\/?$/.test(pathname) ||
          /^(\/.{1,})?\/private\/.{1,}\/?$/.test(pathname)
        ) {
          return false
        }
        return true
      } catch (error) {
        return false
      }
    })

    // console.log('=====items---:', items)

    const pathnames = items.map((item) => new URL(item.href).pathname)

    // console.log('========pathnames:', pathnames)

    const num = findMostFrequentNumber(
      pathnames.map((p) => p.split('/').length),
    )

    let posts = items.filter(
      (i) => new URL(i.href).pathname.split('/').length === num,
    )

    const foundPosts = items.filter(
      (i) => i.href.includes('/creations/') || i.href.includes('/blog/'),
    )

    if (foundPosts.length > 5) {
      posts = foundPosts
    }

    return {
      url: this.extractResult.url,
      timestamp: this.extractResult.timestamp,
      // items: this.extractResult.items,
      items: posts,
    }
  }

  async generate() {
    const { systemPrompt, prompt } = getPrompts(this.extractResult)

    if (this.provider === 'deepseek') {
      const { text } = await generateText({
        model: deepseek('deepseek-chat') as any,
        system: systemPrompt,
        prompt: prompt,
      })

      // console.log('=========text:', text)

      return text
    }

    if (this.provider === 'perplexity') {
      const input = {
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
      }

      try {
        const res = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify(input),
        }).then((r) => r.json())
        // console.log('=====res:', res.choices[0].message.content)

        return res.choices[0].message.content as string
      } catch (error) {
        return ''
      }
    }

    /** use cloudflare */
    const input = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer OR2ZJUHNqJHra5I0jYGTlYS1mSCcKpcQidjhilfu',
    }

    // const model = `@cf/meta/llama-3-8b-instruct`
    // const model = `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
    // const model = '@cf/microsoft/phi-2'
    // const model = '@cf/qwen/qwen1.5-0.5b-chat'
    // const model = '@cf/meta/llama-3.1-70b-instruct'
    // const model = '@cf/meta/llama-3-8b-instruct'
    const model = '@cf/qwen/qwen1.5-14b-chat-awq'

    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/3dfd0b17e39266ada9e7817c05d83a55/ai/run/${decodeURIComponent(model)}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(input),
        },
      ).then((r) => r.json())

      return res.result.response
    } catch (error) {
      return ''
    }
  }

  /**
   * Use AI to analyze webpage content and extract post directory
   * @param extractResult Web extraction result
   * @returns Analysis result containing post directory
   */
  async extractPostDirectory(): Promise<PostDirectoryResult> {
    const { extractResult } = this

    if (this.provider === 'manually') {
      return this.getPostManually()
    }

    try {
      const t0 = Date.now()
      let text = await this.generate()
      const t1 = Date.now()
      console.log('===========generation time:', t1 - t0)

      if (!text) {
        console.warn('AI returned empty response')
        return {
          url: extractResult.url,
          timestamp: extractResult.timestamp,
          items: [],
        }
      }

      let cleanedText = '[]'
      const regex = /\[.*?\]/gs

      const match = regex.exec(text)
      if (match) {
        cleanedText = match[0].trim()
      }

      // Try to parse the JSON directly first
      try {
        const parsedData = JSON.parse(cleanedText)

        // Convert directory list to PostData format for compatibility
        const posts = parsedData.map((item: any) => ({
          title: item.title,
          href: item.href,
        }))

        return {
          url: extractResult.url,
          timestamp: extractResult.timestamp,
          items: posts,
        }
      } catch (e) {
        console.error(e)
        // If direct parsing fails, try regex extraction
        return {
          url: extractResult.url,
          timestamp: extractResult.timestamp,
          items: [],
        }
      }
    } catch (error) {
      console.error('Error extracting post directory:', error)
      return {
        url: extractResult.url,
        timestamp: extractResult.timestamp,
        items: [],
      }
    }
  }
}

function findMostFrequentNumber(arr: number[]): number | null {
  const numberCount: { [key: number]: number } = {}

  arr.forEach((number) => {
    if (numberCount[number]) {
      numberCount[number]++
    } else {
      numberCount[number] = 1
    }
  })

  let mostFrequentNumber: number | null = null
  let maxCount: number = 0

  for (const number in numberCount) {
    const currentNumber = Number(number)
    if (numberCount[currentNumber] > maxCount) {
      mostFrequentNumber = currentNumber
      maxCount = numberCount[currentNumber]
    }
  }

  return mostFrequentNumber
}
