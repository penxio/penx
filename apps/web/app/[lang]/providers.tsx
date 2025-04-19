'use client'

import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { LoginDialog } from '@/components/LoginDialog/LoginDialog'
import { SessionProvider } from '@/components/session'
import { ROOT_DOMAIN } from '@penx/constants'
import { queryClient } from '@penx/query-client'
import { trpc, trpcClient } from '@penx/trpc-client'
import { StoreProvider } from '@/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

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
