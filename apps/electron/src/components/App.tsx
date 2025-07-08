import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { tinykeys } from 'tinykeys'
import { AppProvider } from '@penx/components/AppProvider'
import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { LoginStatus } from '@penx/constants'
import { LocaleProvider } from '@penx/locales'
import { queryClient } from '@penx/query-client'
import { StoreProvider } from '@penx/store'
import { SessionData } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { sleep } from '@penx/utils'
import { Footer } from './Footer'

export function App() {
  return (
    <DashboardProviders>
      {/* <DashboardLayout></DashboardLayout> */}
      <div className="no-drag fixed bottom-0 left-0 right-0 top-0 flex flex-col bg-neutral-50/80">
        {/* <button onClick={ipcHandle}>Transcribe</button> */}
        <div className="flex-1">
          <Input />
        </div>
        <Footer />
      </div>
    </DashboardProviders>
  )
}

export default App
