'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@penx/query-client'
import { SessionProvider } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { trpc, trpcClient } from '@penx/trpc-client'
import { AppProvider } from '../AppProvider/AppProvider'

export function DashboardProviders({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies?: string | null
}) {
  return (
    <>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <StoreProvider>
              <AppProvider>{children}</AppProvider>
            </StoreProvider>
          </trpc.Provider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
