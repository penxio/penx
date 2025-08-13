import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { Markdown } from '@penx/components/AIChat/markdown'
import { ProfileButton } from '@penx/components/ProfileButton'
import { Prompt } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { getOpenAIClient } from '@penx/libs/getOpenAIClient'
import { NovelEditor } from '@penx/novel-editor/components/novel-editor'
import { getSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Textarea } from '@penx/uikit/ui/textarea'
import { Logo } from '@penx/widgets/Logo'
import { DetailApp } from '~/components/ExtensionApp/DetailApp'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { navigation, useQueryNavigations } from '~/hooks/useNavigation'

const client = getOpenAIClient()

export function PageTranslate() {
  // return <NovelEditor></NovelEditor>
  const { current } = useQueryNavigations()
  const { currentCommand } = useCurrentCommand()
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const { copy } = useCopyToClipboard()

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
    if (msg?.type === 'translate-output') {
      console.log('====lastJsonMessage:', lastJsonMessage)
      setResult(msg.payload)
    }
  }, [lastJsonMessage])

  const debouncedTranslate = useDebouncedCallback(async (text: string) => {
    // window.electron.ipcRenderer.send('translate-text', text)
    sendMessage(
      JSON.stringify({
        type: 'translate-input',
        payload: text,
      }),
    )
    return

    const session = await getSession()
    if (!session.accessToken) return
    if (loading) return
    setLoading(true)
    try {
      const stream = await client.chat.completions.create(
        {
          model: 'openai',
          // model: 'openai-fast',
          // model: 'phi',
          messages: [
            {
              role: 'system',
              content: Prompt.TRANSLATE,
            },
            {
              role: 'user',
              content: text.trim(),
            },
          ],
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      )

      let fullText = ''
      for await (const chunk of stream) {
        setLoading(false)
        try {
          const content = chunk.choices[0].delta?.content

          if (content) {
            fullText += content
            console.log('=======fullText:', fullText)
            setResult(fullText)
          }
        } catch (error) {
          console.log('=======error:', error)
        }
      }
    } catch (error) {
      setLoading(false)
      setResult(t`Translate failed, please try again`)
    }
  }, 200)

  useEffect(() => {
    console.log('=====nav.data:', current.data)
    if (current.data?.text) {
      setInput(current.data?.text)
      debouncedTranslate(current.data?.text)
    }
  }, [current])

  return (
    <DetailApp
      className=""
      // actions={
      //   <ActionPanel>
      //     <Action.Item title={<Trans>Create</Trans>} />
      //   </ActionPanel>
      // }
      confirm={{
        title: <Trans>Translate</Trans>,
        shortcut: {
          modifiers: ['$mod'],
          key: 'enter',
        },
        onConfirm: () => {
          debouncedTranslate(input)
        },
      }}
    >
      <div className="flex h-full">
        <div className="min-h-full flex-1 shrink-0">
          <Textarea
            placeholder={t`Translate text`}
            className="h-full flex-1 shrink resize-none rounded-none border-0 bg-transparent text-base focus-visible:ring-0"
            autoFocus
            onKeyDown={(e) => {
              if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.stopPropagation()

                if (e.key === 'Enter' && e.metaKey) {
                  debouncedTranslate(input)
                }
              }
            }}
            value={input}
            onChange={async (e) => {
              const newInput = e.target.value
              setInput(newInput)
              debouncedTranslate(newInput)
            }}
          />
        </div>
        <div
          className="border-foreground/10 min-h-full flex-1 shrink-0 overflow-auto border-l p-3 text-base leading-normal"
          onClick={() => {
            if (!loading) {
              copy(result)
              toast.info(t`Copied to clipboard`)
            }
          }}
        >
          {loading && <LoadingDots className="bg-foreground" />}
          {!loading && <Markdown>{result}</Markdown>}
        </div>
      </div>
    </DetailApp>
  )
}
