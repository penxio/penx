'use client'

import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@penx/query-client'
import { SessionProvider } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { trpc, trpcClient } from '@penx/trpc-client'

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  return (
    <>
      <Toaster className="dark:hidden" richColors />
      <Toaster theme="dark" className="hidden dark:block" richColors />

      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <StoreProvider>
              <GoogleOauthDialog />
              {children}
            </StoreProvider>
          </trpc.Provider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
