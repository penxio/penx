import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { LocaleProvider } from '@penx/locales'
import { WatchEvent } from './components/WatchEvent'

function App(): React.JSX.Element {
  return (
    <LocaleProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DashboardProviders>
          <DashboardLayout></DashboardLayout>
          <WatchEvent />
        </DashboardProviders>
      </ThemeProvider>
      <div id="portal" className="fixed left-0 top-0 z-[100000000]" />
    </LocaleProvider>
  )
}

export default App
