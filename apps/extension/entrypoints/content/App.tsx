import { useState } from 'react'
import { ContentView } from '@/components/content/ContentView'
import { ThemeProvider } from '@/components/ThemeProvider'
import { QueryClientProvider } from '@tanstack/react-query'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { queryClient } from '@penx/query-client'
import { StoreProvider } from '@penx/store'

export default () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <ContentView />
        </StoreProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
