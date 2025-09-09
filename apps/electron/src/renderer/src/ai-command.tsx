import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setConfig } from '@fower/react'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { initPGLiteNodeModelApi } from '@penx/libs/initPGLiteNodeModelApi'
import { LocaleProvider } from '@penx/locales'
import { AICommandApp } from './components/AICommandApp/AICommandApp'
import { setSelection } from './hooks/useSelection'

setConfig({
  prefix: 'penx-',
})

initPGLiteNodeModelApi()

window.electron.ipcRenderer.on('ai-command-window-show', () => {
  //
})

window.electron.ipcRenderer.on('on-text-selection', (_, selection) => {
  console.log('========selection:', selection)
  setSelection(selection)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardProviders>
          <AICommandApp />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  </StrictMode>,
)
