import { PropsWithChildren, useState } from 'react'
import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { LocaleProvider } from '@penx/locales'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'

function App() {
  const [count, setCount] = useState(0)

  const locale = 'en'
  return (
    <LocaleProvider>
      <DashboardProviders>
        <DashboardLayout>
          <div></div>
        </DashboardLayout>
        <div id="portal" />
      </DashboardProviders>
    </LocaleProvider>
  )
}

export default App
