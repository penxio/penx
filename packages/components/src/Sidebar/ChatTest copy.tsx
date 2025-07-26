import React, { useEffect, useState } from 'react'

export function ChatTest() {
  const [poem, setPoem] = useState('')

  useEffect(() => {
    const fetchPoem = async () => {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai',
          messages: [{ role: 'user', content: '珠海有多少人?' }],
          stream: true,
        }),
      })

      if (!response.body) {
        console.error('ReadableStream not supported in this environment.')
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let accumulated = ''

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          console.log('====chunk:', chunk)

          // 这个 chunk 是返回的 JSON 字符串的一部分，可以尝试解析并提取 content 字段文本

          try {
            const json = JSON.parse(chunk)
            console.log('=======json:', json)

            if (
              json.choices &&
              json.choices[0].delta &&
              json.choices[0].delta.content
            ) {
              accumulated += json.choices[0].delta.content
              setPoem(accumulated)
            }
          } catch (e) {
            // chunk 可能不是完整的 JSON，忽略 json 解析错误，等下一段数据
          }
        }
      }
    }

    fetchPoem()
  }, [])

  return (
    <div>
      <h2>Streaming Long Poem about the Sea</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{poem}</pre>
    </div>
  )
}
