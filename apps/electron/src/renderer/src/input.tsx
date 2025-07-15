import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { QuickInputApp } from './components/QuickInputApp/QuickInputApp'

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
          <QuickInputApp />
        </DashboardProviders>
      </ThemeProvider>
    </LocaleProvider>
  </StrictMode>,
)
