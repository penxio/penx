import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
// import { Panel } from './components/Panel/Panel'
import { Panel } from '@penx/panel-app/components/Panel/Panel'

initPGLiteNodeModelApi()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Panel />
  </StrictMode>,
)
