import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { AICommandApp } from './components/AICommandApp/AICommandApp'

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
