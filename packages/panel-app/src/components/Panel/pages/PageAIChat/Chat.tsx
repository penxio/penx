import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { produce } from 'immer'
import ky from 'ky'
import { ApiRes } from '@penx/api'
import { askQuestion } from '@penx/chrome-ai'
import { APP_LOCAL_HOST, isDesktop, isExtension } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { uniqueId } from '@penx/unique-id'
import { sleep } from '@penx/utils'
import { useInput } from './hooks/useInput'
import { getMessages, useMessages } from './hooks/useMessages'
import { getPrompt } from './lib/getPrompt'
import { Messages } from './Messages'
import { SendBox } from './SendBox'

export function Chat() {
  const { messages, setMessages } = useMessages()

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
        .post(`${APP_LOCAL_HOST}/api/rag/retrieve`, {
          json: { text },
        })
        .json<ApiRes<any[]>>()

      // console.log('=======data:', data)
      if (isExtension) {
        const stream = await askQuestion(getPrompt(text, data))
        if (!stream) return
        setLoading(false)

        const messages = getMessages()
        const newMessages = produce(messages, (draft) => {
          draft.push({ id: uniqueId(), content: '', role: 'assistant' })
        })

        setMessages(newMessages)
        await sleep(1)

        for await (const chunk of stream as ReadableStream<string> &
          AsyncIterable<string>) {
          // console.log('======chunk:', chunk)

          const messages = getMessages()
          const newMessages = produce(messages, (draft) => {
            draft[draft.length - 1].content += chunk
          })
          setMessages(newMessages)
        }
      }

      console.log('=======isDesktop:', isDesktop)

      if (isDesktop) {
        sendMessage(
          JSON.stringify({
            type: 'chrome-ai-prompt-input',
            payload: getPrompt(text, data),
          }),
        )
      }
    }
    appEmitter.on('SUBMIT_AI_CHAT', handleSubmit)
    return () => {
      appEmitter.off('SUBMIT_AI_CHAT')
    }
  }, [])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col text-base">
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
