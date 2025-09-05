import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { onMessage } from '@/lib/message'
import App from './App'

onMessage('closeSidePanel', () => {
  window.close()
})

const port = chrome.runtime.connect({ name: 'sidepanel-port' })

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

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
