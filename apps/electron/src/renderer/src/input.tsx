import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QuickInputApp } from './components/QuickInputApp/QuickInputApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuickInputApp />
  </StrictMode>,
)
