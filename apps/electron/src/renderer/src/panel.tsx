import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Panel } from './components/Panel/Panel'
import { initNodeModelApi } from './lib/initNodeModelApi'

initNodeModelApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Panel />
  </StrictMode>,
)
