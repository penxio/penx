import { QueryClientProvider } from '@tanstack/react-query'
import { DashboardLayout } from '@penx/components/DashboardLayout/DashboardLayout'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { DashboardProviders } from '@penx/components/providers/DashboardProviders'
import { SyncProvider } from '@penx/components/providers/SyncProvider'
import { LoginStatus } from '@penx/constants'
import { queryClient } from '@penx/query-client'
import { StoreProvider } from '@penx/store'
import { api, trpc, trpcClient } from '@penx/trpc-client'
import { SessionData } from '@penx/types'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { sleep } from '@penx/utils'
import { AuthProvider } from './AuthProvider'
import './style.css'

function App() {
  const locale = 'en'
  return (
    <LinguiClientProvider initialLocale={locale} initialMessages={{}}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SyncProvider>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              <StoreProvider>
                <DashboardLayout>
                  <main className="flex h-screen items-center justify-center">
                    <div>App...</div>
                  </main>
                </DashboardLayout>
              </StoreProvider>
            </trpc.Provider>
          </SyncProvider>
        </AuthProvider>
      </QueryClientProvider>
    </LinguiClientProvider>
  )
}

export default App
