import { askQuestion } from './askQuestion'
import { translateText } from './translateText'
import { WebSocketClient } from './WebSocketClient'

export async function initTranslate() {
  let window: any = self

  const wsClient = new WebSocketClient('ws://localhost:14158/ws', {
    reconnectDelay: 3000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 20000,
    heartbeatMsg: 'ping',
    onOpen: () => {
      console.log('Connection established')
    },
    onMessage: async (msg) => {
      if (!('Translator' in window)) return

      console.log('Received message:', msg)
      if (typeof msg === 'string') {
        try {
          const data = JSON.parse(msg)
          if (data.type === 'translate-input') {
            console.log('====data:', data.payload)

            const result = await translateText(data.payload, 'en', 'zh')

            wsClient.send(
              JSON.stringify({
                type: 'translate-output',
                payload: result,
              }),
            )
          }

          if (data.type === 'chrome-ai-prompt-input') {
            console.log('====data:', data.payload)

            const stream = await askQuestion(data.payload)

            wsClient.send(
              JSON.stringify({
                type: 'chrome-ai-prompt-output',
                payload: '{{AI-RESPONSE-STARTED}}',
              }),
            )
            for await (const chunk of stream) {
              console.log('======chunk:', chunk)

              wsClient.send(
                JSON.stringify({
                  type: 'chrome-ai-prompt-output',
                  payload: chunk,
                }),
              )
            }

            wsClient.send(
              JSON.stringify({
                type: 'chrome-ai-prompt-output',
                payload: '{{AI-RESPONSE-ENDED}}',
              }),
            )
          }
        } catch (error) {
          //
        }
      }
    },
    onClose: () => console.log('Connection closed'),
    onError: (err) => console.error('Connection error:', err),
  })
}
