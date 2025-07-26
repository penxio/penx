import React, { useEffect, useState } from 'react'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'sk-xxx',
  baseURL: 'http://localhost:4000/api/ai',
  dangerouslyAllowBrowser: true,
})

export function ChatTest() {
  const [poem, setPoem] = useState('')

  useEffect(() => {
    async function run() {
      const stream = await client.chat.completions.create({
        model: 'openai',
        messages: [{ role: 'user', content: '中国有多大' }],
        stream: true,
      })

      let fullText = ''
      for await (const chunk of stream) {
        try {
          const content = chunk.choices[0].delta?.content

          if (content) {
            fullText += content
            setPoem(fullText)
          }
        } catch (error) {
          console.log('=======error:', error)
        }
      }
    }
    run()
  }, [])

  return (
    <div>
      <h2>Streaming Long Poem about the Sea</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{poem}</pre>
    </div>
  )
}
