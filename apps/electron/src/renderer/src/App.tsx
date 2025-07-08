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
    </LocaleProvider>
  )
}

export default App
