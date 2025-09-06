import { onMessage } from '@/lib/message'
import { browser } from '#imports'

export function setupPort() {
  onMessage('closeSidePanel', () => {
    window.close()
  })

  const port = browser.runtime.connect({ name: 'sidepanel-port' })

  port.onMessage.addListener((msg) => {
    if (msg && msg.type === 'YOUR_EVENT_TYPE') {
      console.log(' background message:', msg.payload)
    }
  })

  port.postMessage({ type: 'sidepanel-ready', payload: true })

  const heartbeatInterval = setInterval(() => {
    port.postMessage({ type: 'sidepanel-heartbeat', timestamp: Date.now() })
  }, 20000)

  window.addEventListener('beforeunload', () => {
    clearInterval(heartbeatInterval)
    port.disconnect()
  })
}
