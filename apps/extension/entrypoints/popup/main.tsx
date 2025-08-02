import React from 'react'
import ReactDOM from 'react-dom/client'
import { initNodeModelApi } from '@penx/libs/initNodeModelApi'
import App from './App.tsx'
import './style.css'

initNodeModelApi()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
