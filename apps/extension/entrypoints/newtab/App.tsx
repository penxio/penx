import { PropsWithChildren, useState } from 'react'
import { DashboardLayout } from '@penx/components/DashboardLayout/DashboardLayout'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { DashboardProviders } from '@penx/components/providers/DashboardProviders'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
// import { allMessages } from './appRouterI18n'
import wxtLogo from '/wxt.svg'

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
      </DashboardProviders>
    </LinguiClientProvider>
  )
}

export default App
