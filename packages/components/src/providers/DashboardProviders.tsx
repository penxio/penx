'use client'

import { Buffer } from 'buffer'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@penx/query-client'
import { SessionProvider } from '@penx/session'
import { StoreProvider } from '@penx/store'
import { AppProvider } from '../AppProvider/AppProvider'
import { AreaDialog } from '../AreaDialog/AreaDialog'
import { DeleteCreationDialog } from '../Creation/DeleteCreationDialog/DeleteCreationDialog'
import { StructDialog } from '../StructDialog/StructDialog'

if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}

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
          <StoreProvider>
            <AppProvider>
              <AreaDialog />
              <StructDialog />
              <DeleteCreationDialog />
              {children}
            </AppProvider>
          </StoreProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}
