'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@penx/query-client'
import { SessionProvider } from '@penx/session'
import { StoreProvider } from '@penx/store'

export function RootProviders({
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

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <StoreProvider>{children}</StoreProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
