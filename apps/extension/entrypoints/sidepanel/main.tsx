import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
import App from './App'
import { setupPort } from './setupPort'
import { watchEvent } from './watchEvent'
import './style.css'

initPGLiteNodeModelApi()
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
