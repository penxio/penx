import React from 'react'
import ReactDOM from 'react-dom/client'
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
import App from './App.tsx'
import './style.css'
import { onMessage } from '@/lib/message.ts'

initPGLiteNodeModelApi()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
