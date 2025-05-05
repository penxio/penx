import { PropsWithChildren, useState } from 'react'
import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'

// import { allMessages } from './appRouterI18n'

function App() {
  const [count, setCount] = useState(0)

  const locale = 'en'
  return (
    <LinguiClientProvider
      initialLocale={locale}
      // initialMessages={allMessages[locale]!}
      initialMessages={{}}
    >
      <DashboardProviders>
        <DashboardLayout>
          <div></div>
        </DashboardLayout>
        <div id="portal" />
      </DashboardProviders>
    </LinguiClientProvider>
  )
}

export default App
