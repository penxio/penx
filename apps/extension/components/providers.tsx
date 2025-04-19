'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@penx/query-client'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster className="dark:hidden" richColors />
      <Toaster theme="dark" className="hidden dark:block" richColors />
      {children}
    </QueryClientProvider>
  )
}
