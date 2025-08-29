import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { produce } from 'immer'
import ky from 'ky'
import { ApiRes } from '@penx/api'
import { appEmitter } from '@penx/emitter'
import { uniqueId } from '@penx/unique-id'
import { useInput } from './hooks/useInput'
import { getMessages, useMessages } from './hooks/useMessages'
import { Messages } from './Messages'
import { SendBox } from './SendBox'

interface Reference {
  nodeId: string
  structId: string
  structName: string
  header: string
  content: string
}

function getPrompt(query: string, references: Reference[]) {
  const refTexts = references.map((i) => i.content).join('\n---------------\n')

  console.log('======refTexts:', refTexts)

  return `
You are an expert assistant specialized in providing accurate answers based on provided reference documents. Your task is to answer the user's question using only the given information. Do not invent or assume any facts outside the documents.

User question:
${query}

Reference documents:
${refTexts}

Please follow these rules strictly:
1. Base your answer only on the reference documents above.
2. If information is missing or unclear in the references, respond with "No relevant information found."
3. Write a clear, concise, and structured answer.
4. Use bullet points or numbered lists if multiple points are needed.
5. Respond in the same language as the user's question.
6. Avoid unrelated content or speculation.

Begin your answer below:
  `.trim()
}

export function Chat() {
  const { messages, setMessages } = useMessages()

  console.log('=====messages:', messages)

  const { setInput } = useInput()
  const [loading, setLoading] = useState(false)
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket('ws://localhost:14158/ws', {
    onOpen: () => {
      console.log('>>>>>>>>>>>>>opened:')
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  })

  useEffect(() => {
    const msg = lastJsonMessage as { type: string; payload: string }

    if (msg?.type === 'chrome-ai-prompt-output') {
      console.log('====lastJsonMessage:', lastJsonMessage)
      if (msg.payload === '{{AI-RESPONSE-STARTED}}') {
        setLoading(false)
        const newMessages = produce(messages, (draft) => {
          draft.push({ id: uniqueId(), content: '', role: 'assistant' })
        })
        setMessages(newMessages)
      } else if (msg.payload === '{{AI-RESPONSE-ENDED}}') {
      } else {
        const newMessages = produce(messages, (draft) => {
          draft[draft.length - 1].content += msg.payload
        })
        setMessages(newMessages)
      }
      // setResult(result + msg.payload)
    }
  }, [lastJsonMessage])

  useEffect(() => {
    async function handleSubmit(text: string) {
      setLoading(true)
      const messages = getMessages()
      const newMessages = produce(messages, (draft) => {
        draft.push({ id: uniqueId(), content: text, role: 'user' })
      })
      setMessages(newMessages)
      setInput('')

      const { data } = await ky
        .post('http://localhost:14158/api/rag/retrieve', {
          json: { text },
        })
        .json<ApiRes<any[]>>()

      console.log('=======data:', data)

      sendMessage(
        JSON.stringify({
          type: 'chrome-ai-prompt-input',
          payload: getPrompt(text, data),
        }),
      )
    }
    appEmitter.on('SUBMIT_AI_CHAT', handleSubmit)
    return () => {
      appEmitter.off('SUBMIT_AI_CHAT')
    }
  }, [])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="min-h-0 w-full flex-1">
        <Messages
          chatId={''}
          loading={loading}
          messages={messages}
          isReadonly={true}
        />
      </div>
      <div className="mx-auto flex w-full gap-2 px-2 pb-2 md:max-w-3xl">
        <SendBox />
      </div>
    </div>
  )
}
