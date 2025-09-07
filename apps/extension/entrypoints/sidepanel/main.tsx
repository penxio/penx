import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initNodeModelApi } from '@penx/libs/initNodeModelApi'
import App from './App'
import { setupPort } from './setupPort'
import { watchEvent } from './watchEvent'

initNodeModelApi()
setupPort()
watchEvent()

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
