'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@penx/query-client'
import { SessionProvider } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { trpc, trpcClient } from '@penx/trpc-client'

export function DashboardProviders({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies?: string | null
}) {
  return (
    <>
      <Toaster className="dark:hidden" richColors />
      <Toaster theme="dark" className="hidden dark:block" richColors />
      <div>xhelo</div>

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <StoreProvider>{children}</StoreProvider>
          </trpc.Provider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
