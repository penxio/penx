import { QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '@penx/components/AppProvider'
import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { LoginStatus } from '@penx/constants'
import { LocaleProvider } from '@penx/locales'
import { queryClient } from '@penx/query-client'
import { StoreProvider } from '@penx/store'
import { SessionData } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { sleep } from '@penx/utils'
import { Updater } from './Updater'
import './style.css'

function App() {
  return (
    <LocaleProvider>
      <DashboardProviders>
        <DashboardLayout></DashboardLayout>
        <Updater />
      </DashboardProviders>
    </LocaleProvider>
  )
}

export default App
