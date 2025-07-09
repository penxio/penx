import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { LocaleProvider } from '@penx/locales'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <LocaleProvider>
      <DashboardProviders>
        <DashboardLayout></DashboardLayout>
      </DashboardProviders>
      <div id="portal" className="fixed left-0 top-0 z-[100000000]" />
    </LocaleProvider>
  )
}

export default App
