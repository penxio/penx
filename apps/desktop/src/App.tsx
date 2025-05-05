import { QueryClientProvider } from '@tanstack/react-query'
import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { LoginStatus } from '@penx/constants'
import { queryClient } from '@penx/query-client'
import { StoreProvider } from '@penx/store'
import { api, trpc, trpcClient } from '@penx/trpc-client'
import { SessionData } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { sleep } from '@penx/utils'
import { AuthProvider } from './AuthProvider'
import './style.css'
import { AppProvider } from '@penx/components/AppProvider'
import { Updater } from './Updater'

function App() {
  const locale = 'en'

  return (
    <LinguiClientProvider initialLocale={locale} initialMessages={{}}>
      <DashboardProviders>
        <DashboardLayout></DashboardLayout>
        <Updater />
      </DashboardProviders>
    </LinguiClientProvider>
  )
}

export default App
