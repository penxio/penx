import { onMessage } from '@/lib/message'
import { browser } from '#imports'
import { appEmitter } from '@penx/emitter'
import { store } from '@penx/store'

export function setupPort() {
  onMessage('closeSidePanel', () => {
    window.close()
  })

  onMessage('updateBrowserTab', async () => {
    appEmitter.emit('UPDATE_BROWSER_TAB')
    await store.creations.refetchCreations()
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
